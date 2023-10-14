import asyncio
import warnings

import puresnmp


warnings.filterwarnings("ignore")

client = puresnmp.PyWrapper(
    puresnmp.Client("192.168.69.208", puresnmp.V1("public"))
)

async def main():
    OWNER_NAME = "1.3.6.1.2.1.1.4.0"
    TRAY_EMPTY_DESCRIPTION = "1.3.6.1.2.1.43.18.1.1.8.1.11"
    NOT_IT_FAM = "1.3.6.1.2.1.1.4.71"

    coro = await client.get(TRAY_EMPTY_DESCRIPTION)
    print(coro)

asyncio.run(main())

