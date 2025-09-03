module gigstream::gigstream;

use std::string::String;
use std::string;

public struct Gigstream has key, store{
    id: UID,    
}

public struct Freelancer has key, store{
    id: UID,
    owner: address, 
    name: String,
    bio: String,
    skills: String,
    portfolio: String,
}

public struct Clientprofile has key {
    id: UID,
    owner: address,
    name: String,
    company: String,
    description: String,
    projects_posted: u64,
}


public struct Joblisting has key {
    id: UID,
    client: address,
    title: String,
    description: String,    
    required_skills: String,
    budget: u64,
    deadline: u64,
    status: String, 
}

fun init(ctx: &mut TxContext) {
    let gig_stream = Gigstream { id: object::new(ctx) };
    transfer::public_transfer(gig_stream, tx_context::sender(ctx));
}


public entry fun create_freelancer_profile(
    name: String,
    bio: String,
    skills: String,
    portfolio:String,
    ctx: &mut TxContext
) {
    let freelancer = Freelancer {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        name,
        bio,
        skills,
        portfolio,
    };
    transfer::share_object(freelancer);
}


public entry fun create_client_profile(
    name: String,
    company: String,
    description: String,
    ctx: &mut TxContext
) {
    let client_profile = Clientprofile {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        name,
        company,
        description,
        projects_posted: 0,
    };
    transfer::share_object(client_profile);
}


public entry fun create_job_listing(
    title: String,
    description: String,
    required_skills: String,
    budget: u64,
    deadline: u64,
    ctx: &mut TxContext
) {
    let job_listing = Joblisting {
        id: object::new(ctx),
        client: tx_context::sender(ctx),
        title,
        description,
        required_skills,
        budget,
        deadline,
        status:string::utf8(b"Open"),
    };
    transfer::share_object(job_listing);
}
/**public entry fun apply_to_job(
    job: &mut Joblisting,
    freelancer: &Freelancer,
    ctx: &mut TxContext
) {
    assert!(job.status == string::utf8(b"Open"), 1);
    }
    **/