import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ListService } from './list.service';
import { Create, Updata, List } from './dto/list.dto';
import { AuthGuard } from '../auth/auth.guard';
// import { roles } from '../auth/auth.constants';
import { Role } from '../enums/role.enum';
import { Roles } from '../roles.decorator';

@Controller('list')
@Roles(Role.ADMIN, Role.USER)
@UseGuards(AuthGuard)
export class ListController {
    constructor(private readonly listService: ListService){}

    @Get('')
    getAll(@Request() req) {
        console.log(req.user);
        return this.listService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        console.log(id)
        return this.listService.getById(id);
    }

    @Put(':id')
    updataList(@Param() params, @Body() updataList: Updata) {
        return this.listService.updataList(params.id, updataList);
    }

    @Post('')
    createList(@Body() newList: Create, @Request() req): Promise<List> {
        console.log(req.user);
        newList.user = req.user.userId;
        console.log(newList);
        return this.listService.createList(newList);
    }

    @Delete(':id')
    deleteList(@Param() param) {
        return this.listService.deleteList(param.id);
    }


}
