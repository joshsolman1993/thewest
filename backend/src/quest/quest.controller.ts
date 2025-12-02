import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuestService } from './quest.service';

@Controller('quest')
@UseGuards(AuthGuard('jwt'))
export class QuestController {
    constructor(private questService: QuestService) { }

    @Get()
    async findAll() {
        return this.questService.findAll();
    }

    @Get('my')
    async findMyQuests(@Request() req) {
        return this.questService.findUserQuests(req.user.userId);
    }

    @Post(':id/accept')
    async accept(@Request() req, @Param('id') id: string) {
        // We need to pass the User entity. Since we only have userId in req.user,
        // we cast it to { id: userId } which satisfies the DeepPartial<User> often used,
        // or we rely on the service to handle it. 
        // The service expects a User entity.
        return this.questService.accept({ id: req.user.userId } as any, id);
    }

    @Post(':id/complete')
    async complete(@Request() req, @Param('id') id: string) {
        return this.questService.complete({ id: req.user.userId } as any, id);
    }
}
