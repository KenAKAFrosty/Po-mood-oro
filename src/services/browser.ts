import { Context } from "effect";

export class BrowserWindow extends Context.Tag("BrowserWindow")<BrowserWindow, typeof window>() {}
