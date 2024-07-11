import express from 'express';
import RevenueController from '../controllers/revenue.controller';

const routeRevenue = express.Router();
routeRevenue.get('/revenue-dashbroad', RevenueController.RevenueDashbroad);

routeRevenue.get('/revenue-invest', RevenueController.InvestEquipments);

routeRevenue.get('/revenue-invest-detail', RevenueController.InvestEquipmentsDetail);

export default routeRevenue;
