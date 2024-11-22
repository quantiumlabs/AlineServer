import { Router } from "express";
import dashboardRouter from "./Modules/Dashboard/router";
import checkoutRouter from "./Modules/Checkout/router";

const router = Router();

const defaultPaths: { name: string; router: Router }[] = [
  {
    name: "/dashboard",
    router: dashboardRouter,
  },
  {
    name: "/checkout",
    router: checkoutRouter,
  },
];

defaultPaths.forEach((path) => {
  router.use(path.name, path.router);
});

export default router;