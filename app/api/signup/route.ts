import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}