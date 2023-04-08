import express, {Express, Request, Response} from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

enum ModerationStatus {
    REJECTED = 'rejected',
    APPROVED = 'approved'
}

const app: Express = express();
app.use(bodyParser.json());

app.post('/events', async (req: Request, res: Response): Promise<void> => {
    const {type, data} = req.body;

    if (type === 'CommentCreated') {
        const status: ModerationStatus = data.content.includes('bad word') ?
            ModerationStatus.REJECTED :
            ModerationStatus.APPROVED;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});