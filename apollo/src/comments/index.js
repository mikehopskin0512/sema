import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import {index, commentBank} from './commentService';
// const clip = require("text-clipper").default;
import clip from "text-clipper";

const route = Router();

export default (app, passport) => {
    app.use('/${version}/comments', route);
    
    route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
        const { searchQuery } = req.query;
        console.log(req.query);
        try {
            const topResult = commentBank.searchTopComment(searchQuery);
            return res.status(201).send({
                topResult,
            });
        } catch (error) {
            console.log(error);
            logger.error(error);
            return res.status(error.statusCode).send(error);
        }
    });
};
