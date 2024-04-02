import prismaClient from "@/lib/prisma"

export default function Register() {

    async function click(formData: FormData) {
        "use server"
        console.log('hi')
        await prismaClient.user.create({
            data: {
                email: "poop@sjsu.edu",
                password: "password",
                firstName: "firstName",
                lastName: "lastName",
                major: "CS",
            }
        })
    }

    return (
        <form action={click}>
            <button type="submit">post</button>
        </form>
    )
}