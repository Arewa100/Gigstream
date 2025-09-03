module gigstream::lock;

use sui::dynamic_object_field as dof;
use sui::event;

const ELockKeyMismatch: u64 = 0;

public struct LockedObjectKey has copy, drop, store {}

public struct Locked<phantom T: key + store> has key, store {
    id: UID,
    key: ID,
}

public struct Key has key, store { id: UID }

public struct LockCreated has copy, drop {
    lock_id: ID,
    key_id: ID,
    creator: address,
    item_id: ID,
}

public fun lock<T: key + store>(obj: T, ctx: &mut TxContext): (Locked<T>, Key) {
    let key = Key { id: object::new(ctx) };
    let mut lock = Locked {
        id: object::new(ctx),
        key: object::id(&key),
    };

    event::emit(LockCreated {
        lock_id: object::id(&lock),
        key_id: object::id(&key),
        creator: ctx.sender(),
        item_id: object::id(&obj),
    });

    dof::add(&mut lock.id, LockedObjectKey {}, obj);

    (lock, key)
}


public fun unlock<T: key + store>(mut locked: Locked<T>, key: Key): T {
    assert!(locked.key == object::id(&key), ELockKeyMismatch);
    let Key { id } = key;
    id.delete();

    let obj = dof::remove<LockedObjectKey, T>(&mut locked.id, LockedObjectKey {});

    event::emit(LockDestroyed { lock_id: object::id(&locked) });

    let Locked { id, key: _ } = locked;
    id.delete();
    obj
}

public struct LockDestroyed has copy, drop {
    lock_id: ID,
}

