module gigstream::escrow;
use sui::dynamic_object_field as dof;
use sui::event;
use gigstream::lock::{Locked, Key, unlock};

const EMismatchedSenderRecipient: u64 = 0;
const EMismatchedExchangeObject: u64 = 1;


public struct EscrowedObjectKey has copy, drop, store {}

public struct Escrow<phantom T: key + store> has key, store {
    id: UID,
    client: address,
    freelancer: address,
    exchange_key: ID,
}

public struct EscrowCreated has copy, drop {
    escrow_id: ID,
    client: address,
    freelancer: address,
    item_id: ID,
}

public fun create_escrow<T: key + store>(
    escrowed: T,
    exchange_key: ID,
    recipient: address,
    ctx: &mut TxContext,
) {
    let mut escrow = Escrow<T> {
        id: object::new(ctx),
        client: ctx.sender(),
        freelancer: recipient,
        exchange_key,
    };
    event::emit(EscrowCreated {
        escrow_id: object::id(&escrow),
        client: ctx.sender(),
        freelancer: recipient,
        item_id: object::id(&escrowed),
    });

    dof::add(&mut escrow.id, EscrowedObjectKey {}, escrowed);

    transfer::public_share_object(escrow);
}


public fun swap<T: key + store, U: key + store>(
    mut escrow: Escrow<T>,
    key: Key,
    locked: Locked<U>,
    ctx: &TxContext,
): T {
    let escrowed = dof::remove<EscrowedObjectKey, T>(&mut escrow.id, EscrowedObjectKey {});

    let Escrow {
        id,
        client,
        freelancer,
        exchange_key,
    } = escrow;

    assert!(freelancer == ctx.sender(), EMismatchedSenderRecipient);
    assert!(exchange_key == object::id(&key), EMismatchedExchangeObject);

    transfer::public_transfer(locked.unlock(key), client);

    event::emit(EscrowSwapped {
        escrow_id: id.to_inner(),
    });

    id.delete();

    escrowed
}

public fun return_to_sender<T: key + store>(mut escrow: Escrow<T>, ctx: &TxContext): T {
    event::emit(EscrowCancelled {
        escrow_id: object::id(&escrow),
    });

    let escrowed = dof::remove<EscrowedObjectKey, T>(&mut escrow.id, EscrowedObjectKey {});

    let Escrow {
        id,
        client,
        freelancer: _,
        exchange_key: _,
    } = escrow;

    assert!(client == ctx.sender(), EMismatchedSenderRecipient);
    id.delete();
    escrowed
}

public struct EscrowSwapped has copy, drop {
    escrow_id: ID,
}

public struct EscrowCancelled has copy, drop {
    escrow_id: ID,
}