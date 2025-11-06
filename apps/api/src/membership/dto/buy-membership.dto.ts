import { IsEnum, IsInt, IsString, Min } from "class-validator";

export enum MembershipPeriod

export class BuyMembershipDto {
  userId: string;
  duration: number;
  period: MembershipPeriod;
}
