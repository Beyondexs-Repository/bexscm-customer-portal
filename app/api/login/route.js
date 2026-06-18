import { db } from "@/lib/db"
import { getDefaultRouteForRole } from "@/config/role-pages"

function normalizePhone(value) {
  return String(value ?? "").replace(/\D/g, "")
}

function getPhoneSearchTerms(phoneNumber) {
  const lastTenDigits = phoneNumber.slice(-10)

  return Array.from(new Set([phoneNumber, lastTenDigits].filter(Boolean)))
}

function normalizedPhoneSql(alias = "u") {
  return `
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(${alias}.phone, '+', ''),
              '-', ''
            ),
            ' ',
            ''
          ),
          '(',
          ''
        ),
        ')',
        ''
      ),
      '.',
      ''
    )
  `
}

function getFullName(user) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ")
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const phoneNumber = normalizePhone(body.phoneNumber)

    if (!phoneNumber) {
      return Response.json(
        { message: "Phone number is required." },
        { status: 400 }
      )
    }

    const phoneSearchTerms = getPhoneSearchTerms(phoneNumber)

    const [users] = await db.execute(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        r.role_key,
        r.role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE ${normalizedPhoneSql("u")} LIKE ?
        OR ${normalizedPhoneSql("u")} LIKE ?
      LIMIT 1
      `,
      [
        `%${phoneSearchTerms[0]}`,
        `%${phoneSearchTerms[1] ?? phoneSearchTerms[0]}`,
      ]
    )

    const user = users[0]

    if (!user) {
      return Response.json(
        { message: "User not found." },
        { status: 404 }
      )
    }

    if (!user.is_active) {
      return Response.json(
        { message: "User account is inactive." },
        { status: 403 }
      )
    }

    const navigateTo = getDefaultRouteForRole(user.role_key) ?? "/";

    return Response.json({
      role: {
        userId: user.id,
        id: user.role_key,
        name: user.role_name,
        navigateTo,
        phoneNumber: user.phone,
      },
      profile: {
        id: user.id,
        name: getFullName(user),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        avatar: "",
      },
    })
  } catch (error) {
    console.error("Login error:", error)

    if (error?.code === "ER_TOO_MANY_USER_CONNECTIONS") {
      return Response.json(
        { message: "Database connection limit reached. Please try again in a moment." },
        { status: 503 }
      )
    }

    return Response.json(
      { message: "Something went wrong." },
      { status: 500 }
    )
  }
}
