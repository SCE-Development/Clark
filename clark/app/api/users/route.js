import { connectToDatabase } from "@/util/mongo";

//Get all users
export async function GET() {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('User').find().toArray();
        return Response.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const db = await connectToDatabase();
        const { firstName, lastName, password, email } = req.body;
        const newUser = {
          firstName,
          lastName,
          password,
          email
        };
    
        const result = await db.collection('User').insertOne(newUser);
        return Response.json({ message: 'User added successfully', result });
      } catch (error) {
        console.error('Error adding user:', error);
        return Response.json({ error: 'Failed to add user' }, { status: 500 });
      } 
}
