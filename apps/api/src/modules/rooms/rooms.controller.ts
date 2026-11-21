import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  createRoomSchema,
  roomAvailabilityQuerySchema,
  roomsQuerySchema,
  updateRoomSchema,
  type CreateRoomInput,
  type RoomAvailabilityQueryInput,
  type RoomsQueryInput,
  type UpdateRoomInput,
} from '@repo/shared/schemas/rooms.schema';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  addRoom(
    @Body(new ZodValidationPipe(createRoomSchema)) body: CreateRoomInput,
  ) {
    return this.roomService.addRoom(body);
  }

  @Get()
  getRooms(
    @Query(new ZodValidationPipe(roomsQuerySchema)) query: RoomsQueryInput,
  ) {
    return this.roomService.getRooms(query);
  }

  @Get(':id/availability')
  getRoomAvailability(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(roomAvailabilityQuerySchema))
    query: RoomAvailabilityQueryInput,
  ) {
    return this.roomService.getRoomAvailability(id, query.date);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  updateRoom(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateRoomSchema)) body: UpdateRoomInput,
  ) {
    return this.roomService.updateRoom(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteRoom(@Param('id') id: string) {
    return this.roomService.deleteRoom(id);
  }
}
