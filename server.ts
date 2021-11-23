import { Application, Router, RouterContext } from "./deps.ts";
import { renderHtml } from "./render_html.ts";

const app = new Application();
const router = new Router();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port} ...`,
  );
});

app.addEventListener("error", (evt) => {
  console.error(evt.error);
});

const controller = {
  greet(ctx: RouterContext): void {
    ctx.response.body = "Hello, World!";
  },

  whether(ctx: RouterContext): void {
    ctx.response.body = renderHtml(ctx.params.name as string);
  },
};

router.get("/", controller.greet);
router.get("/location/:name", controller.whether);

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
