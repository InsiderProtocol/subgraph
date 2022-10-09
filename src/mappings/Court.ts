import { Insider, Guardian, Court, Stake, Vote } from '../../generated/schema'
import { CourtCreated, Court as CourtContract, Court__courtsResult, Staked, GuardianVoted, InsiderVoted } from '../../generated/Court/Court'
import { BigInt, log } from '@graphprotocol/graph-ts'
import { COUNTER_ID, getCount_stakes, getCount_votes } from '../helpers'

function setCourtData(court: Court | null, c_court: Court__courtsResult): void {
  if (court === null) return

  court.address1 = c_court.value0.toHexString();
  court.address2 = c_court.value1.toHexString();
  court.region = c_court.value2 as BigInt
  court.method = c_court.value3 as BigInt
  court.coinPrice = c_court.value4 as BigInt
  court.address1VoteCount = new BigInt(0)
  court.address2VoteCount = new BigInt(0)
  court.duration = c_court.value7 as BigInt
  court.createdAt = c_court.value8 as BigInt
  court.status = BigInt.fromString(c_court.value9.toString())
  court.ipfsData = c_court.value10.toString()
}

export function handleCourtCreated(event: CourtCreated): void {
  let court = new Court(event.params.courtId.toHexString())
  let courtContract = CourtContract.bind(event.address)
  let c_court = courtContract.courts(event.params.courtId)

  setCourtData(court, c_court)

  court.updatedAt = event.block.timestamp as BigInt
  court.createdAt = event.block.timestamp as BigInt
  court.save()
}



export function handleStaked(event: Staked): void {


    let court = Court.load(event.params.courtId.toHexString());
    if (!court) {
        log.warning('Undefined court {}', [event.params.courtId.toString()]);
        return;
    }

    let guardian = Guardian.load(event.params.guardian.toHexString());
    if (!guardian) {
        guardian = new Guardian(event.params.guardian.toHexString());
        guardian.courtsCount = BigInt.fromI32(1);
    } else {
        guardian.courtsCount = guardian.courtsCount.plus(BigInt.fromI32(1));
    }

    guardian.courtsCount = guardian.courtsCount.plus(BigInt.fromI32(1));
    guardian.updatedAt = event.block.timestamp as BigInt
    guardian.save()

    court.updatedAt = event.block.timestamp as BigInt
    court.save()

    let stake = new Stake(getCount_stakes(COUNTER_ID).toHexString());

    stake.court = event.params.courtId.toHexString();
    stake.amount = event.params.stakeAmount as BigInt;
    stake.guardian = event.params.guardian.toHexString();

    stake.createdAt = event.block.timestamp as BigInt;
    stake.updatedAt = event.block.timestamp as BigInt;

    stake.save();

  }
  

export function handleGuardianVoted(event: GuardianVoted): void {

    let court = Court.load(event.params.courtId.toHexString());
    if (!court) {
        log.warning('Undefined court {}', [event.params.courtId.toString()]);
        return;
    }

    let guardian = Guardian.load(event.params.guardian.toHexString());
    if (!guardian) {
        guardian = new Guardian(event.params.guardian.toHexString());
        guardian.courtsCount = BigInt.fromI32(1);
    } else {
        guardian.courtsCount = guardian.courtsCount.plus(BigInt.fromI32(1));
    }

    guardian.updatedAt = event.block.timestamp as BigInt
    guardian.save()

    court.updatedAt = event.block.timestamp as BigInt
    court.save()

    let vote = new Vote(getCount_votes(COUNTER_ID).toHexString());

    vote.court = event.params.courtId.toHexString();
    vote.guardian = event.params.guardian.toHexString();
    vote.vote = BigInt.fromI32(event.params.vote);
    vote.status = BigInt.fromI32(1);

    vote.createdAt = event.block.timestamp as BigInt;
    vote.updatedAt = event.block.timestamp as BigInt;

    vote.save();

}

export function handleInsiderVoted(event: InsiderVoted): void {

  let court = Court.load(event.params.courtId.toHexString());
  if (!court) {
      log.warning('Undefined court {}', [event.params.courtId.toString()]);
      return;
  }

  let insider = Insider.load(event.params.insider.toHexString());
  if (!insider) {
      insider = new Insider(event.params.insider.toHexString());
      insider.courtsCount = BigInt.fromI32(1);
  } else {
      insider.courtsCount = insider.courtsCount.plus(BigInt.fromI32(1));
  }

  insider.updatedAt = event.block.timestamp as BigInt
  insider.save()

  court.updatedAt = event.block.timestamp as BigInt
  court.save()

  let vote = new Vote(getCount_votes(COUNTER_ID).toHexString());

  vote.court = event.params.courtId.toHexString();
  vote.insider = event.params.insider.toHexString();
  vote.vote = BigInt.fromI32(event.params.vote);
  vote.status = BigInt.fromI32(1);

  vote.createdAt = event.block.timestamp as BigInt;
  vote.updatedAt = event.block.timestamp as BigInt;

  vote.save();

}
  