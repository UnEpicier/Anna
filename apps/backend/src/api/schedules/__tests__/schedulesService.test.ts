import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";
import type { Schedule } from "@repo/app-types";
import { schedule as mockSchedule, SchedulesRepository } from "@/api/schedules/schedulesRepository";
import { SchedulesService } from "@/api/schedules/schedulesService";

vi.mock("@/api/schedules/schedulesRepository");

describe("schedulesService", () => {
	let schedulesServiceInstance: SchedulesService;
	let schedulesRepositoryInstance: SchedulesRepository;

	beforeEach(() => {
		schedulesRepositoryInstance = new SchedulesRepository();
		schedulesServiceInstance = new SchedulesService(schedulesRepositoryInstance);
	});

	describe("findAll", () => {
		it("return schedules", async () => {
			// Arrange
			(schedulesRepositoryInstance.findAllAsync as Mock).mockReturnValue([mockSchedule]);

			// Act
			const result = await schedulesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals("Schedules found");
			expect(result.responseObject).toEqual([mockSchedule]);
		});

		it("returns a not found error for no schedules found", async () => {
			// Arrange
			(schedulesRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

			// Act
			const result = await schedulesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).equals("No schedules found");
			expect(result.responseObject).toBeNull();
		});

		it("handles errors for findAllAsync", async () => {
			// Arrange
			(schedulesRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

			// Act
			const result = await schedulesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.success).toBeFalsy();
			expect(result.message).equals("An error occurred while retrieving schedules.");
			expect(result.responseObject).toBeNull();
		});
	});

	describe("update", () => {
		it("updates and returns the schedule", async () => {
			// Arrange
			const updateData: Partial<Schedule> = { open: false };
			const updatedInformations: Schedule = { ...mockSchedule, ...updateData };
			(schedulesRepositoryInstance.updateAsync as Mock).mockReturnValue(updatedInformations);

			// Act
			const result = await schedulesServiceInstance.update(mockSchedule.day, updateData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual("Schedule updated successfully");
			expect(result.responseObject).toEqual(updatedInformations);
		});

		it("handles errors for updateAsync", async () => {
			// Arrange
			const updateData: Partial<Schedule> = { open: false };
			(schedulesRepositoryInstance.updateAsync as Mock).mockRejectedValue(new Error("Database error"));

			// Act
			const result = await schedulesServiceInstance.update(mockSchedule.day, updateData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual("An error occurred while updating schedule.");
			expect(result.responseObject).toBeNull();
		});
	});
});
