module gigstream::escrow;

use sui::dynamic_object_field as dof;
use sui::event;
use sui::coin::{Self as coin, Coin};
use gigstream::lock::{Locked, Key};

const EMismatchedSenderRecipient: u64 = 0;
const EMismatchedExchangeObject: u64 = 1;
const TREASURY: address = @0xCAFE;

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

public struct EscrowSwapped has copy, drop {
    escrow_id: ID,
}

public struct EscrowCancelled has copy, drop {
    escrow_id: ID,
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

public fun swap<T: key + store>(
    mut escrow: Escrow<T>,
    key: Key,
    locked: Locked<Coin<T>>,
    ctx: &mut TxContext,
): Coin<T> {
    let escrowed = dof::remove<EscrowedObjectKey, Coin<T>>(&mut escrow.id, EscrowedObjectKey {});

    let Escrow {
        id,
        client: _,
        freelancer,
        exchange_key,
    } = escrow;

    assert!(freelancer == ctx.sender(), EMismatchedSenderRecipient);
    assert!(exchange_key == object::id(&key), EMismatchedExchangeObject);

    let mut coin_released = locked.unlock(key);

    // Calculate value before mutable borrow
    let coin_released_value = coin::value<T>(&coin_released);

    // Take 2% fee
    let fee = coin::split<T>(&mut coin_released, coin_released_value / 50, ctx);
    transfer::public_transfer(fee, TREASURY);

    // Send remainder to freelancer
    transfer::public_transfer(coin_released, freelancer);

    event::emit(EscrowSwapped { escrow_id: id.to_inner() });
    id.delete();

    escrowed
}



public fun return_to_sender<S>(
    mut escrow: Escrow<Coin<S>>,
    ctx: &mut TxContext
) {
    event::emit(EscrowCancelled { escrow_id: object::id(&escrow) });

    let mut escrowed = dof::remove<EscrowedObjectKey, Coin<S>>(&mut escrow.id, EscrowedObjectKey {});

    let Escrow {
        id,
        client,
        freelancer: _,
        exchange_key: _,
    } = escrow;

    assert!(client == ctx.sender(), EMismatchedSenderRecipient);

    // Calculate value before mutable borrow
    let escrowed_value = coin::value<S>(&escrowed);

    // Deduct 2% fee and return the rest to client
    let fee = coin::split<S>(&mut escrowed, escrowed_value / 50, ctx);
    transfer::public_transfer(fee, TREASURY);

    // Return 98% to client
    transfer::public_transfer(escrowed, client);

    id.delete();
    // No return value
}
