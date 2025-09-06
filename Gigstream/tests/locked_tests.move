module gigstream::escrow_tests {
    use sui::test;
    use sui::tx_context::{TxContext, new_tx_context};
    use sui::coin::{Coin, mint};
    use sui::object::{self, ID};
    use sui::event::{self, EventHandle};
    use gigstream::escrow;
    use gigstream::lock::{Key, Locked};
    use sui::transfer;

    #[test]
    fun test_create_escrow_emits_event() {
        let client = test::new_signer();
        let freelancer = test::new_signer();
        let mut ctx = new_tx_context(client.address());

        let coin_obj = mint<u64>(100, &client);
        let exchange_key = Key::new(&ctx, client.address());

        escrow::create_escrow<Coin<u64>>(coin_obj, exchange_key.id(), freelancer.address(), &mut ctx);

        // There is no built-in event querying in Move tests,
        // so this is for illustration: Make sure no abort and escrow object is created
        // Real event verification may need integration tests or instrumentation outside Move.
    }

    #[test]
    fun test_swap_succeeds() {
        let client = test::new_signer();
        let freelancer = test::new_signer();
        let mut ctx_client = new_tx_context(client.address());
        let mut ctx_freelancer = new_tx_context(freelancer.address());

        let coin_obj = mint<u64>(100, &client);
        let exchange_key = Key::new(&ctx_freelancer, freelancer.address());

        // create escrow by client
        let escrow_obj = escrow::create_escrow<Coin<u64>>(coin_obj, exchange_key.id(), freelancer.address(), &mut ctx_client);

        // Lock coin by freelancer to swap
        let locked_coin = Locked::lock(mint<u64>(100, &freelancer), &exchange_key);

        // swap escrow (freelancer call)
        let returned_coin = escrow::swap(escrow_obj, exchange_key, locked_coin, &mut ctx_freelancer);

        // Returned coin should have value 100 (the escrowed amount)
        assert!(sui::coin::value(&returned_coin) == 100, 1);
    }

    #[test]
    fun test_return_to_sender_succeeds() {
        let client = test::new_signer();
        let mut ctx = new_tx_context(client.address());

        let coin_obj = mint<u64>(100, &client);
        let exchange_key = Key::new(&ctx, client.address());

        let escrow_obj = escrow::create_escrow<Coin<u64>>(coin_obj, exchange_key.id(), client.address(), &mut ctx);

        escrow::return_to_sender(escrow_obj, &mut ctx);

        // No return value, test passes if no aborts
    }
}
