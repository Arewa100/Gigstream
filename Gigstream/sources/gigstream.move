module gigstream::gigstream {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;

    // Error codes
    const E_JOB_NOT_OPEN: u64 = 1;
    const E_NOT_JOB_OWNER: u64 = 2;
    const E_ALREADY_APPLIED: u64 = 3;
    const E_INVALID_STATUS: u64 = 4;

    // Job status constants
    const STATUS_OPEN: vector<u8> = b"Open";
    const STATUS_CLOSED: vector<u8> = b"Closed";
    const STATUS_IN_PROGRESS: vector<u8> = b"InProgress";
    const STATUS_COMPLETED: vector<u8> = b"Completed";

    public struct Gigstream has key {
        id: UID,
    }


    public struct Freelancer has key, store {
        id: UID,
        owner: address,
        name: String,
        bio: String,
        skills: vector<String>, 
        portfolio: String,
        rating: u64, 
        jobs_completed: u64,
    }

    public struct ClientProfile has key, store { 
        id: UID,
        owner: address,
        name: String,
        company: String,
        description: String,
        projects_posted: u64,
        rating: u64, 
    }

    
    public struct JobListing has key, store {
        id: UID,
        client: address,
        title: String,
        description: String,
        required_skills: vector<String>, 
        budget: u64,
        deadline: u64, 
        status: String,
        applications: vector<address>, 
        assigned_freelancer: Option<address>, 
        created_at: u64, 
    }


    public struct JobApplication has key, store {
        id: UID,
        job_id: address,
        freelancer: address,
        proposal: String,
        quoted_price: u64,
        estimated_delivery: u64,
        created_at: u64,
    }


    fun init(ctx: &mut TxContext) {
        let gig_stream = Gigstream { 
            id: object::new(ctx) 
        };
        transfer::share_object(gig_stream);
    }

    public entry fun create_freelancer_profile(
        name: String,
        bio: String,
        skills: vector<String>, // Accept vector of skills
        portfolio: String,
        ctx: &mut TxContext
    ) {
        let freelancer = Freelancer {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            name,
            bio,
            skills,
            portfolio,
            rating: 0,
            jobs_completed: 0,
        };
        transfer::share_object(freelancer);
    }


    public entry fun create_client_profile(
        name: String,
        company: String,
        description: String,
        ctx: &mut TxContext
    ) {
        let client_profile = ClientProfile {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            name,
            company,
            description,
            projects_posted: 0,
            rating: 0,
        };
        transfer::share_object(client_profile);
    }

    /// Create a job listing
    public entry fun create_job_listing(
        client_profile: &mut ClientProfile,
        title: String,
        description: String,
        required_skills: vector<String>, // Accept vector of skills
        budget: u64,
        deadline: u64,
        ctx: &mut TxContext
    ) {
        // Verify the caller owns the client profile
        assert!(client_profile.owner == tx_context::sender(ctx), E_NOT_JOB_OWNER);

        let job_listing = JobListing {
            id: object::new(ctx),
            client: tx_context::sender(ctx),
            title,
            description,
            required_skills,
            budget,
            deadline,
            status: string::utf8(STATUS_OPEN),
            applications: vector::empty(),
            assigned_freelancer: option::none(),
            created_at: tx_context::epoch(ctx),
        };

        // Increment projects posted counter
        client_profile.projects_posted = client_profile.projects_posted + 1;
        
        transfer::share_object(job_listing);
    }

    /// Apply to a job listing
    public entry fun apply_to_job(
        job: &mut JobListing,
        freelancer: &Freelancer,
        proposal: String,
        quoted_price: u64,
        estimated_delivery: u64,
        ctx: &mut TxContext
    ) {
        // Verify job is open
        assert!(job.status == string::utf8(STATUS_OPEN), E_JOB_NOT_OPEN);
        
        // Verify the caller owns the freelancer profile
        assert!(freelancer.owner == tx_context::sender(ctx), E_NOT_JOB_OWNER);
        
        // Check if already applied
        let freelancer_address = tx_context::sender(ctx);
        assert!(!vector::contains(&job.applications, &freelancer_address), E_ALREADY_APPLIED);

        // Create application
        let application = JobApplication {
            id: object::new(ctx),
            job_id: object::uid_to_address(&job.id),
            freelancer: freelancer_address,
            proposal,
            quoted_price,
            estimated_delivery,
            created_at: tx_context::epoch(ctx),
        };

        // Add freelancer to applications list
        vector::push_back(&mut job.applications, freelancer_address);
        
        transfer::share_object(application);
    }

    /// Assign a job to a freelancer (client only)
    public entry fun assign_job(
        job: &mut JobListing,
        freelancer_address: address,
        ctx: &mut TxContext
    ) {
        // Verify caller is the job client
        assert!(job.client == tx_context::sender(ctx), E_NOT_JOB_OWNER);
        
        // Verify job is open
        assert!(job.status == string::utf8(STATUS_OPEN), E_JOB_NOT_OPEN);
        
        // Verify freelancer applied
        assert!(vector::contains(&job.applications, &freelancer_address), E_INVALID_STATUS);

        // Assign job and update status
        job.assigned_freelancer = option::some(freelancer_address);
        job.status = string::utf8(STATUS_IN_PROGRESS);
    }

    /// Mark job as completed (client only)
    public entry fun complete_job(
        job: &mut JobListing,
        freelancer: &mut Freelancer,
        ctx: &mut TxContext
    ) {
        // Verify caller is the job client
        assert!(job.client == tx_context::sender(ctx), E_NOT_JOB_OWNER);
        
        // Verify job is in progress
        assert!(job.status == string::utf8(STATUS_IN_PROGRESS), E_INVALID_STATUS);
        
        // Update job status
        job.status = string::utf8(STATUS_COMPLETED);
        
        // Update freelancer stats
        freelancer.jobs_completed = freelancer.jobs_completed + 1;
    }

    /// Cancel/close a job (client only)
    public entry fun close_job(
        job: &mut JobListing,
        ctx: &mut TxContext
    ) {
        // Verify caller is the job client
        assert!(job.client == tx_context::sender(ctx), E_NOT_JOB_OWNER);
        
        // Update job status
        job.status = string::utf8(STATUS_CLOSED);
        job.assigned_freelancer = option::none();
    }

    /// Update freelancer profile
    public entry fun update_freelancer_profile(
        freelancer: &mut Freelancer,
        name: String,
        bio: String,
        skills: vector<String>,
        portfolio: String,
        ctx: &mut TxContext
    ) {
        assert!(freelancer.owner == tx_context::sender(ctx), E_NOT_JOB_OWNER);
        
        freelancer.name = name;
        freelancer.bio = bio;
        freelancer.skills = skills;
        freelancer.portfolio = portfolio;
    }

    /// Update client profile
    public entry fun update_client_profile(
        client: &mut ClientProfile,
        name: String,
        company: String,
        description: String,
        ctx: &mut TxContext
    ) {
        assert!(client.owner == tx_context::sender(ctx), E_NOT_JOB_OWNER);
        
        client.name = name;
        client.company = company;
        client.description = description;
        
        // Emit profile update event
        event::emit(ClientProfileUpdated {
            profile_id: object::uid_to_address(&client.id),
            owner: tx_context::sender(ctx),
            timestamp: tx_context::epoch(ctx),
        });
    }
    
    /// Event struct for client profile updates
    public struct ClientProfileUpdated has copy, drop, store {
        profile_id: address,
        owner: address,
        timestamp: u64,
    }

    public fun get_freelancer_info(freelancer: &Freelancer): (String, String, u64, u64) {
        (freelancer.name, freelancer.bio, freelancer.rating, freelancer.jobs_completed)
    }

    public fun get_job_info(job: &JobListing): (String, String, u64, u64, String) {
        (job.title, job.description, job.budget, job.deadline, job.status)
    }

    public fun get_client_info(client: &ClientProfile): (String, String, u64) {
        (client.name, client.company, client.projects_posted)
    }
}