import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { ListService } from './list.service';
import { CreateDTO, UpdataDTO, ListDTO, CreateWithUserDTO } from './dto/list.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../enums/role.enum';
import { Roles } from '../roles.decorator';
import {Request as ExperessReq} from 'express';

@Controller('list')
@Roles(Role.ADMIN, Role.USER)
@UseGuards(AuthGuard)
export class ListController {
    constructor(private readonly listService: ListService){}

    @Get('')
    @Throttle(5, 60)
    getAll(@Request() req: ExperessReq) {
        const { userId, roleId } = req.user;
        if(roleId === Role.ADMIN) return this.listService.getAll();
        if(roleId === Role.USER) return this.listService.getAllByUserId(userId);
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.listService.getById(id);
    }

    @Put(':id')
    updataList(@Request() req: ExperessReq, @Param('id', ParseIntPipe) id: number, @Body() updataList: UpdataDTO) {
        const { userId, roleId } = req.user;
        if(roleId === Role.ADMIN) return  this.listService.updataList(id, updataList);
        if(roleId === Role.USER) return  this.listService.updataListByUserId(id, updataList, userId);
    }

    @Post('')
    @SkipThrottle()
    createList(@Body() newList: CreateDTO, @Request() req:ExperessReq): Promise<ListDTO> {
        const postData: CreateWithUserDTO = {...newList, user: req.user.userId}
        return this.listService.createList(postData);
    }

    @Delete(':id')
    deleteList(@Request() req: ExperessReq, @Param('id', ParseIntPipe) id: number) {
        const { userId, roleId } = req.user;
        if(roleId === Role.ADMIN) return  this.listService.deleteList(id);
        if(roleId === Role.USER) return  this.listService.deleteListByUserId(id, userId);
    }
}
