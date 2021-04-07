import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateDTO, UpdataDTO, ListDTO, CreateWithUserDTO } from './dto/list.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../enums/role.enum';
import { Roles } from '../roles.decorator';

@Controller('list')
@Roles(Role.ADMIN, Role.USER)
@UseGuards(AuthGuard)
export class ListController {
    constructor(private readonly listService: ListService){}

    @Get('')
    getAll(@Request() req) {
        const { userId, roleId } = req.user;
        if(roleId === Role.ADMIN) return this.listService.getAll();
        if(roleId === Role.USER) return this.listService.getAllByUserId(userId);
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.listService.getById(id);
    }

    @Put(':id')
    updataList(@Request() req, @Param() param, @Body() updataList: UpdataDTO) {
        const { userId, roleId } = req.user;
        if(roleId === Role.ADMIN) return  this.listService.updataList(param.id, updataList);
        if(roleId === Role.USER) return  this.listService.updataListByUserId(param.id, updataList, userId);
    }

    @Post('')
    createList(@Body() newList: CreateDTO, @Request() req): Promise<ListDTO> {
        const postData: CreateWithUserDTO = {...newList, user: req.user.userId}
        return this.listService.createList(postData);
    }

    @Delete(':id')
    deleteList(@Request() req, @Param() param) {
        const { userId, roleId } = req.user;
        if(roleId === Role.ADMIN) return  this.listService.deleteList(param.id);
        if(roleId === Role.USER) return  this.listService.deleteListByUserId(param.id, userId);
    }
}
