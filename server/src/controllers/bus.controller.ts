import express, { Request, Response } from 'express';

import Bus from '../models/bus.model';
import Price from '../models/price.model';
import SeatType from '../models/seatType.model';
import Ticket from '../models/ticket.model';
import IBus from '../types/bus.types';
import IPrice from '../types/price.types';
import ISeatTypes from '../types/seatType.types';
import protect from '../middlewares/protect';
import authorize from '../middlewares/authorise';

const router = express();

router.get('/', async(req: Request | any, res: Response)=>{
    try {
        const page = +req.query.page | 1;
        const limit = +req.query.limit | 10;

        const offset = (page - 1) * limit;

        const buses: IBus[] = await Bus.find()
                                        .populate({path: 'companyNameId', select: 'companyName'})
                                        .populate('priceId')
                                        .populate({path: 'seats', populate: 'seatTypeId'})
                                        .skip(offset)
                                        .limit(limit)
                                        .lean()
                                        .exec();

        res.status(200).json({
            status: 'success',
            buses
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err.message
        });
    }
});

router.post('/', protect, authorize(["admin", "owner"]), async(req: Request, res: Response)=>{
    try {
        const inpPrice: IPrice = req.body.price;
        let seats = req.body.seats;

        const seatType: ISeatTypes = seats.seatType;

        const seatTypeRegister = await SeatType.create(seatType);

        seats = {...seats, seatTypeId: seatTypeRegister._id};
        const price: IPrice = await Price.create(inpPrice);

        const busDetail: IBus = await Bus.create({...req.body, priceId: price._id, seats});

        res.status(201).json({
            status: 'success',
            bus: busDetail
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err.message
        });
    }
});

router.patch('/:id', protect, authorize(["admin", "owner"]), async(req: Request, res: Response)=>{
    try {
        const id: string = req.params.id;
        
        const updatedBusDetails = await Bus.findByIdAndUpdate(id, {...req.body}, {new: true});

        res.status(201).json({
            status: 'success',
            bus: updatedBusDetails
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err.message
        });
    }
})

router.patch('/:id/price', protect, authorize(["admin", "owner"]), async(req: Request, res: Response)=>{
    try {
        const id: string = req.params.id;

        const busDetail: IBus | null = await Bus.findById(id).lean().exec();

        const updatedPrice = await Price.findByIdAndUpdate(busDetail?.price, ...req.body, {new: true})

        res.status(201).json({
            status: 'success',
            price: updatedPrice
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err.message
        });
    }
});

router.delete('/:id', protect, authorize(["admin", "owner"]), async(req: Request, res: Response)=>{
    try {
        const id: string = req.params.id;

        const busDetail: IBus | null = await Bus.findById(id).lean().exec();

        await Price.findByIdAndDelete(busDetail?.price);

        await Bus.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'deleted successfully'
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err.message
        });
    }
})

export default router;