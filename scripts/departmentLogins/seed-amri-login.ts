import "dotenv/config"
import {prisma} from '../../lib/prisma';
import bcrypt from 'bcrypt';

async function seedAmriLogin(){
    const password = await bcrypt.hash("ChangeMe123!",10);

    await prisma.user.upsert({
        where:{
            email:"amri@example.com"
        },
        update:{},
        create:{
            name:"Agricultural Mechanical Research Institute",
            email:"amri@example.com",
            password,
            role:"DEPT_HEAD",
            departmentId:"amri"
        }
    })
}
seedAmriLogin()
.catch(err=>{
    console.error("seeding failed",err)
    process.exit(1)
})
.finally(async()=>{
    prisma.$disconnect()
})