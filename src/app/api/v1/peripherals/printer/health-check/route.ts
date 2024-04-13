import { NextRequest } from "next/server";
import { Printer } from "../config";
import PeripheralNotAvaliable from "@/util/responses/PeripheralNotAvaliable";
import Ok from "@/util/responses/Ok";


export async function GET(req: NextRequest) {
  try {
    if(!Printer.enabled) throw new PeripheralNotAvaliable();

    const url = new URL("/healthcheck/printer", Printer.url);

    await fetch(url, {})
      .then(() => {

      }).catch(() => {
        throw new PeripheralNotAvaliable();
      })

    return new Ok();
  }catch(res) {
    return res;
  }
}