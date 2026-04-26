import type { Gym } from "@/generated/prisma/client";
import type { GymsRepository } from "@/repositories/gyms-repository";

interface RegisterGymParams {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface RegisterGymReturn {
  gym: Gym;
}

export class RegisterGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: RegisterGymParams): Promise<RegisterGymReturn> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
