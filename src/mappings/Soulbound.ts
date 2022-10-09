
import {
    Soulbound as SoulboundContract,
    Transfer
} from "../../generated/Soulbound/Soulbound";
import { Soulbound, Owner } from "../../generated/schema";
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ZERO_ADDRESS } from '../helpers';

export function handleTransfer(event: Transfer): void {

    let tree = Soulbound.load(event.params.tokenId.toHexString());
    if (!tree) {
        tree = new Soulbound(event.params.tokenId.toHexString());
        tree.createdAt = event.block.timestamp as BigInt;
    }
    tree.updatedAt = event.block.timestamp as BigInt;
    tree.owner = event.params.to.toHexString();
    tree.save();

    let ownerTo = Owner.load(event.params.to.toHexString());
    if (!ownerTo) {
        ownerTo = new Owner(event.params.to.toHexString());
        ownerTo.createdAt = event.block.timestamp as BigInt;
    }

    ownerTo.updatedAt = event.block.timestamp as BigInt;
    ownerTo.save();

    if (event.params.from.notEqual(Address.fromString(ZERO_ADDRESS))) {
        let ownerFrom = Owner.load(event.params.from.toHexString());
        if (!ownerFrom) {
            ownerFrom = new Owner(event.params.from.toHexString());
            ownerFrom.createdAt = event.block.timestamp as BigInt;
        }
        ownerFrom.updatedAt = event.block.timestamp as BigInt;
        ownerFrom.save();
    }

}




