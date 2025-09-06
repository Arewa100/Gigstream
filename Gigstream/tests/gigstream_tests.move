/*
#[test_only]
module gigstream::gigstream_tests;
// uncomment this line to import the module
// use gigstream::gigstream;

const ENotImplemented: u64 = 0;

#[test]
fun test_gigstream() {
    // pass
}

#[test, expected_failure(abort_code = ::gigstream::gigstream_tests::ENotImplemented)]
fun test_gigstream_fail() {
    abort ENotImplemented
}
*/
/***
#[cfg(test)]
#[test_only]
module gigstream::gigstream_tests {
    use gigstream::gigstream::*;
    use gigstream::gigstream::{
        create_client_profile, create_freelancer_profile, create_job_listing, apply_to_job,
        assign_job, complete_job, close_job, update_freelancer_profile, update_client_profile,
        get_freelancer_info, get_client_info, get_job_info, Freelancer, ClientProfile, JobListing,
        JobApplication, STATUS_OPEN, STATUS_IN_PROGRESS, STATUS_COMPLETED, STATUS_CLOSED,
        E_NOT_JOB_OWNER, E_ALREADY_APPLIED, E_INVALID_STATUS, E_JOB_NOT_OPEN
    };
    use sui::test_scenario::{Self, Scenario};
    use sui::test_utils;
    use std::string;
    use std::vector;
    use std::option;

    // Test addresses
    const ADMIN: address = @0xA;
    const CLIENT1: address = @0xB;
    const CLIENT2: address = @0xC;
    const FREELANCER1: address = @0xD;
    const FREELANCER2: address = @0xE;

    #[test]
    fun test_init() {
        let mut scenario = test_scenario::begin(ADMIN);
        {
            init(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            assert!(test_scenario::has_most_recent_shared<Gigstream>(), 0);
        };
        
        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_freelancer_profile() {
        let mut scenario = test_scenario::begin(FREELANCER1);
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let skills = vector[
                string::utf8(b"Rust"),
                string::utf8(b"Blockchain"),
                string::utf8(b"Smart Contracts")
            ];

            create_freelancer_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"Experienced blockchain developer"),
                skills,
                string::utf8(b"github.com/johndoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);
            let (name, bio, rating, jobs_completed) = get_freelancer_info(&freelancer);
            
            assert!(name == string::utf8(b"John Doe"), 0);
            assert!(bio == string::utf8(b"Experienced blockchain developer"), 1);
            assert!(rating == 0, 2);
            assert!(jobs_completed == 0, 3);
            assert!(freelancer.owner == FREELANCER1, 4);
            
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_client_profile() {
        let mut scenario = test_scenario::begin(CLIENT1);
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Leading technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let client = test_scenario::take_shared<ClientProfile>(&scenario);
            let (name, company, projects_posted) = get_client_info(&client);
            
            assert!(name == string::utf8(b"Alice Smith"), 0);
            assert!(company == string::utf8(b"TechCorp Inc"), 1);
            assert!(projects_posted == 0, 2);
            assert!(client.owner == CLIENT1, 3);
            
            test_scenario::return_shared(client);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_create_job_listing() {
        let mut scenario = test_scenario::begin(CLIENT1);
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Leading technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut client_profile = test_scenario::take_shared<ClientProfile>(&scenario);
            let required_skills = vector[
                string::utf8(b"Rust"),
                string::utf8(b"Move")
            ];

            create_job_listing(
                &mut client_profile,
                string::utf8(b"Smart Contract Development"),
                string::utf8(b"Need a smart contract for DeFi platform"),
                required_skills,
                1000,
                1234567890,
                test_scenario::ctx(&mut scenario)
            );

            // Check that projects_posted was incremented
            let (_, _, projects_posted) = get_client_info(&client_profile);
            assert!(projects_posted == 1, 0);
            
            test_scenario::return_shared(client_profile);
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let job = test_scenario::take_shared<JobListing>(&scenario);
            let (title, description, budget, deadline, status) = get_job_info(&job);
            
            assert!(title == string::utf8(b"Smart Contract Development"), 0);
            assert!(description == string::utf8(b"Need a smart contract for DeFi platform"), 1);
            assert!(budget == 1000, 2);
            assert!(deadline == 1234567890, 3);
            assert!(status == string::utf8(STATUS_OPEN), 4);
            assert!(job.client == CLIENT1, 5);
            
            test_scenario::return_shared(job);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = E_NOT_JOB_OWNER)]
    fun test_create_job_listing_wrong_owner() {
        let mut scenario = test_scenario::begin(CLIENT1);
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Leading technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        // Try to create job listing from different address
        test_scenario::next_tx(&mut scenario, CLIENT2);
        {
            let mut client_profile = test_scenario::take_shared<ClientProfile>(&scenario);
            let required_skills = vector[string::utf8(b"Rust")];

            create_job_listing(
                &mut client_profile,
                string::utf8(b"Test Job"),
                string::utf8(b"Test Description"),
                required_skills,
                1000,
                1234567890,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(client_profile);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_apply_to_job() {
        let mut scenario = test_scenario::begin(CLIENT1);
        
        // Setup: Create client profile and job listing
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Leading technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut client_profile = test_scenario::take_shared<ClientProfile>(&scenario);
            let required_skills = vector[string::utf8(b"Rust")];

            create_job_listing(
                &mut client_profile,
                string::utf8(b"Smart Contract Development"),
                string::utf8(b"Need a smart contract for DeFi platform"),
                required_skills,
                1000,
                1234567890,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(client_profile);
        };

        // Create freelancer profile
        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let skills = vector[string::utf8(b"Rust"), string::utf8(b"Move")];
            create_freelancer_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"Blockchain developer"),
                skills,
                string::utf8(b"github.com/johndoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        // Apply to job
        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            apply_to_job(
                &mut job,
                &freelancer,
                string::utf8(b"I can build this smart contract efficiently"),
                800,
                1234567800,
                test_scenario::ctx(&mut scenario)
            );

            // Check that freelancer was added to applications
            assert!(vector::contains(&job.applications, &FREELANCER1), 0);
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            assert!(test_scenario::has_most_recent_shared<JobApplication>(), 0);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = E_ALREADY_APPLIED)]
    fun test_apply_to_job_twice() {
        let mut scenario = test_scenario::begin(CLIENT1);
        
        // Setup
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Leading technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut client_profile = test_scenario::take_shared<ClientProfile>(&scenario);
            let required_skills = vector[string::utf8(b"Rust")];

            create_job_listing(
                &mut client_profile,
                string::utf8(b"Smart Contract Development"),
                string::utf8(b"Need a smart contract"),
                required_skills,
                1000,
                1234567890,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(client_profile);
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let skills = vector[string::utf8(b"Rust")];
            create_freelancer_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"Blockchain developer"),
                skills,
                string::utf8(b"github.com/johndoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        // First application
        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            apply_to_job(
                &mut job,
                &freelancer,
                string::utf8(b"First application"),
                800,
                1234567800,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        // Second application (should fail)
        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            apply_to_job(
                &mut job,
                &freelancer,
                string::utf8(b"Second application"),
                700,
                1234567700,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_assign_job() {
        let mut scenario = setup_job_with_application();

        // Assign job to freelancer
        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);

            assign_job(
                &mut job,
                FREELANCER1,
                test_scenario::ctx(&mut scenario)
            );

            assert!(job.status == string::utf8(STATUS_IN_PROGRESS), 0);
            assert!(option::is_some(&job.assigned_freelancer), 1);
            assert!(option::extract(&mut job.assigned_freelancer) == FREELANCER1, 2);
            
            test_scenario::return_shared(job);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = E_NOT_JOB_OWNER)]
    fun test_assign_job_wrong_owner() {
        let mut scenario = setup_job_with_application();

        // Try to assign job from wrong address
        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);

            assign_job(
                &mut job,
                FREELANCER1,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(job);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_complete_job() {
        let mut scenario = setup_assigned_job();

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let mut freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            let jobs_completed_before = freelancer.jobs_completed;

            complete_job(
                &mut job,
                &mut freelancer,
                test_scenario::ctx(&mut scenario)
            );

            assert!(job.status == string::utf8(STATUS_COMPLETED), 0);
            assert!(freelancer.jobs_completed == jobs_completed_before + 1, 1);
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = E_INVALID_STATUS)]
    fun test_complete_job_wrong_status() {
        let mut scenario = setup_job_with_application();

        // Try to complete job that's not in progress
        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let mut freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            complete_job(
                &mut job,
                &mut freelancer,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_close_job() {
        let mut scenario = setup_job_with_application();

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);

            close_job(
                &mut job,
                test_scenario::ctx(&mut scenario)
            );

            assert!(job.status == string::utf8(STATUS_CLOSED), 0);
            assert!(option::is_none(&job.assigned_freelancer), 1);
            
            test_scenario::return_shared(job);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_freelancer_profile() {
        let mut scenario = test_scenario::begin(FREELANCER1);
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let skills = vector[string::utf8(b"Rust")];
            create_freelancer_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"Developer"),
                skills,
                string::utf8(b"github.com/johndoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let mut freelancer = test_scenario::take_shared<Freelancer>(&scenario);
            let new_skills = vector[
                string::utf8(b"Rust"),
                string::utf8(b"TypeScript"),
                string::utf8(b"React")
            ];

            update_freelancer_profile(
                &mut freelancer,
                string::utf8(b"John Smith"),
                string::utf8(b"Senior Full-Stack Developer"),
                new_skills,
                string::utf8(b"johnsmith.dev"),
                test_scenario::ctx(&mut scenario)
            );

            assert!(freelancer.name == string::utf8(b"John Smith"), 0);
            assert!(freelancer.bio == string::utf8(b"Senior Full-Stack Developer"), 1);
            assert!(freelancer.portfolio == string::utf8(b"johnsmith.dev"), 2);
            
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_client_profile() {
        let mut scenario = test_scenario::begin(CLIENT1);
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut client = test_scenario::take_shared<ClientProfile>(&scenario);

            update_client_profile(
                &mut client,
                string::utf8(b"Alice Johnson"),
                string::utf8(b"TechCorp LLC"),
                string::utf8(b"Leading blockchain technology company"),
                test_scenario::ctx(&mut scenario)
            );

            assert!(client.name == string::utf8(b"Alice Johnson"), 0);
            assert!(client.company == string::utf8(b"TechCorp LLC"), 1);
            assert!(client.description == string::utf8(b"Leading blockchain technology company"), 2);
            
            test_scenario::return_shared(client);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = E_JOB_NOT_OPEN)]
    fun test_apply_to_closed_job() {
        let mut scenario = setup_job_with_application();

        // Close the job first
        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            close_job(&mut job, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(job);
        };

        // Try to apply to closed job
        test_scenario::next_tx(&mut scenario, FREELANCER2);
        {
            let skills = vector[string::utf8(b"JavaScript")];
            create_freelancer_profile(
                string::utf8(b"Jane Doe"),
                string::utf8(b"Frontend developer"),
                skills,
                string::utf8(b"github.com/janedoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, FREELANCER2);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            apply_to_job(
                &mut job,
                &freelancer,
                string::utf8(b"I can help with this"),
                900,
                1234567850,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_full_job_lifecycle() {
        let mut scenario = test_scenario::begin(CLIENT1);
        
        // 1. Initialize
        {
            init(test_scenario::ctx(&mut scenario));
        };

        // 2. Create client profile
        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        // 3. Create job listing
        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut client_profile = test_scenario::take_shared<ClientProfile>(&scenario);
            let required_skills = vector[string::utf8(b"Rust")];

            create_job_listing(
                &mut client_profile,
                string::utf8(b"Smart Contract Development"),
                string::utf8(b"Build a DeFi smart contract"),
                required_skills,
                1000,
                1234567890,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(client_profile);
        };

        // 4. Create freelancer profile
        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let skills = vector[string::utf8(b"Rust"), string::utf8(b"Move")];
            create_freelancer_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"Blockchain developer"),
                skills,
                string::utf8(b"github.com/johndoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        // 5. Apply to job
        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            apply_to_job(
                &mut job,
                &freelancer,
                string::utf8(b"I can build this efficiently"),
                800,
                1234567800,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        // 6. Assign job
        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);

            assign_job(
                &mut job,
                FREELANCER1,
                test_scenario::ctx(&mut scenario)
            );

            assert!(job.status == string::utf8(STATUS_IN_PROGRESS), 0);
            
            test_scenario::return_shared(job);
        };

        // 7. Complete job
        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let mut freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            complete_job(
                &mut job,
                &mut freelancer,
                test_scenario::ctx(&mut scenario)
            );

            assert!(job.status == string::utf8(STATUS_COMPLETED), 0);
            assert!(freelancer.jobs_completed == 1, 1);
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_freelancers_apply() {
        let mut scenario = test_scenario::begin(CLIENT1);
        
        // Setup job
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut client_profile = test_scenario::take_shared<ClientProfile>(&scenario);
            let required_skills = vector[string::utf8(b"Rust")];

            create_job_listing(
                &mut client_profile,
                string::utf8(b"Smart Contract Development"),
                string::utf8(b"Build a smart contract"),
                required_skills,
                1000,
                1234567890,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(client_profile);
        };

        // Create first freelancer and apply
        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let skills = vector[string::utf8(b"Rust")];
            create_freelancer_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"Blockchain developer"),
                skills,
                string::utf8(b"github.com/johndoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            apply_to_job(
                &mut job,
                &freelancer,
                string::utf8(b"Freelancer 1 proposal"),
                800,
                1234567800,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        // Create second freelancer and apply
        test_scenario::next_tx(&mut scenario, FREELANCER2);
        {
            let skills = vector[string::utf8(b"Rust"), string::utf8(b"Solidity")];
            create_freelancer_profile(
                string::utf8(b"Jane Smith"),
                string::utf8(b"Smart contract expert"),
                skills,
                string::utf8(b"github.com/janesmith"),
                test_scenario::ctx(&mut scenario)
    );
};

test_scenario::next_tx(&mut scenario, FREELANCER2);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            apply_to_job(
                &mut job,
                &freelancer,
                string::utf8(b"Freelancer 2 proposal"),
                750,
                1234567750,
                test_scenario::ctx(&mut scenario)
            );

            // Verify both freelancers are in applications
            assert!(vector::contains(&job.applications, &FREELANCER1), 0);
            assert!(vector::contains(&job.applications, &FREELANCER2), 1);
            assert!(vector::length(&job.applications) == 2, 2);
            
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = E_NOT_JOB_OWNER)]
    fun test_update_freelancer_profile_wrong_owner() {
        let mut scenario = test_scenario::begin(FREELANCER1);
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let skills = vector[string::utf8(b"Rust")];
            create_freelancer_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"Developer"),
                skills,
                string::utf8(b"github.com/johndoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        // Try to update from different address
        test_scenario::next_tx(&mut scenario, FREELANCER2);
        {
            let mut freelancer = test_scenario::take_shared<Freelancer>(&scenario);
            let new_skills = vector[string::utf8(b"Python")];

            update_freelancer_profile(
                &mut freelancer,
                string::utf8(b"Hacker"),
                string::utf8(b"Malicious actor"),
                new_skills,
                string::utf8(b"evil.com"),
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(freelancer);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_job_application_data() {
        let mut scenario = setup_job_with_application();

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let application = test_scenario::take_shared<JobApplication>(&scenario);
            
            assert!(application.freelancer == FREELANCER1, 0);
            assert!(application.proposal == string::utf8(b"I can build this smart contract efficiently"), 1);
            assert!(application.quoted_price == 800, 2);
            assert!(application.estimated_delivery == 1234567800, 3);
            
            test_scenario::return_shared(application);
        };

        test_scenario::end(scenario);
    }

    // Helper function to setup a scenario with a job and an application
    // Helper function to setup a scenario with a job and an application
    fun setup_job_with_application(): Scenario {
        let mut scenario = test_scenario::begin(CLIENT1);
        
        {
            init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            create_client_profile(
                string::utf8(b"Alice Smith"),
                string::utf8(b"TechCorp Inc"),
                string::utf8(b"Technology company"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, CLIENT1);
        {
            let mut client_profile = test_scenario::take_shared<ClientProfile>(&scenario);
            let required_skills = vector[string::utf8(b"Rust")];

            create_job_listing(
                &mut client_profile,
                string::utf8(b"Smart Contract Development"),
                string::utf8(b"Need a smart contract for DeFi platform"),
                required_skills,
                1000,
                1234567890,
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(client_profile);
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let skills = vector[string::utf8(b"Rust"), string::utf8(b"Move")];
            create_freelancer_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"Blockchain developer"),
                skills,
                string::utf8(b"github.com/johndoe"),
                test_scenario::ctx(&mut scenario)
            );
        };

        test_scenario::next_tx(&mut scenario, FREELANCER1);
        {
            let mut job = test_scenario::take_shared<JobListing>(&scenario);
            let freelancer = test_scenario::take_shared<Freelancer>(&scenario);

            apply_to_job(
                &mut job,
                &freelancer,
                string::utf8(b"I can build this smart contract efficiently"),
                800,
                1234567800,
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(job);
            test_scenario::return_shared(freelancer);
        };

        scenario
    }
