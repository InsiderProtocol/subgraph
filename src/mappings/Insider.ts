import { Insider, Room } from '../../generated/schema';
import {
    RoomCreated,
    Insider as InsiderContract,
} from '../../generated/Insider/Insider';
import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import {ZERO_ADDRESS } from '../helpers';


// function setInsiderFields(insider: Insider | null, net_insider: Insider__insidersResult): void {
//     if (insider === null) return;
//     insider.method = net_insider.value0 as BigInt;

// }

export function handleRoomCreated(event: RoomCreated): void {

    let insider = Insider.load(event.params.insider.toHexString());
    if (!insider) {
        insider = new Insider(event.params.insider.toHexString());
        insider.region=BigInt.fromI32(0);
        insider.methods=BigInt.fromI32(0);
        insider.courtsCount=BigInt.fromI32(0);
        insider.score=BigInt.fromI32(0);
        insider.createdAt = event.block.timestamp as BigInt;

    } 

    insider.updatedAt = event.block.timestamp as BigInt;
    insider.save();

    let room = new Room(event.params.roomId.toHex());
    room.method = event.params.method as BigInt;
    room.insider = event.params.insider.toHexString();
    room.createdAt = event.block.timestamp as BigInt;
    room.updatedAt = event.block.timestamp as BigInt;

    room.save();
}
