
'use client'

import { useEffect, useState } from 'react'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { Camera, Mail, Pencil, Phone, Save, UserRound, X } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const roleMap = {
  O: 'Owner',
  D: 'Department Manager',
  T: 'Territory Manager',
  S: 'Store Manager',
  E: 'Employee',
}

const mobileCountries = getCountries().map((country) => ({
  country,
  code: `+${getCountryCallingCode(country)}`,
}))
const preferredCountryByCode = { '+1': 'US', '+44': 'GB', '+7': 'RU', '+61': 'AU' }

function getCountryForCode(code) {
  return preferredCountryByCode[code] || mobileCountries.find((item) => item.code === code)?.country || ''
}

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [emailID, setEmailID] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [mobileCountry, setMobileCountry] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [displayRole, setDisplayRole] = useState('Role not assigned')
  const [avatar, setAvatar] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isActive, setIsActive] = useState(null)

  const [originalProfile, setOriginalProfile] = useState({
    name: '',
    emailID: '',
    countryCode: '',
    mobileNumber: '',
  })

  useEffect(() => {
    const storedName = localStorage.getItem('name') || ''
    const storedEmail = localStorage.getItem('emailID') || ''
    const storedCountryCode = localStorage.getItem('countryCode') || ''
    const storedMobile = localStorage.getItem('mobileNumber') || ''
    const storedRole = (localStorage.getItem('roles') || '')
      .trim()
      .toUpperCase()
    const storedAvatar = localStorage.getItem('avatar') || ''
    const storedStatus = localStorage.getItem('isActive')
    setIsActive(storedStatus === 'true' ? true : storedStatus === 'false' ? false : null)

    setName(storedName)
    setEmailID(storedEmail)
    setCountryCode(storedCountryCode)
    setMobileCountry(getCountryForCode(storedCountryCode))
    setMobileNumber(storedMobile)
    setAvatar(storedAvatar)
    setDisplayRole(roleMap[storedRole] || 'Role not assigned')

    setOriginalProfile({
      name: storedName,
      emailID: storedEmail,
      countryCode: storedCountryCode,
      mobileNumber: storedMobile,
    })
  }, [])

  const handleCancel = () => {
    setName(originalProfile.name)
    setEmailID(originalProfile.emailID)
    setCountryCode(originalProfile.countryCode)
    setMobileCountry(getCountryForCode(originalProfile.countryCode))
    setMobileNumber(originalProfile.mobileNumber)
    setIsEditing(false)
  }

  const handleSave = () => {
    localStorage.setItem('name', name)
    localStorage.setItem('emailID', emailID)
    localStorage.setItem('countryCode', countryCode)
    localStorage.setItem('mobileNumber', mobileNumber)

    setOriginalProfile({
      name,
      emailID,
      countryCode,
      mobileNumber,
    })

    setIsEditing(false)
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a JPG, PNG, or SVG image.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be 2MB or less.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result || '')
      setAvatar(result)
      localStorage.setItem('avatar', result)
    }

    reader.readAsDataURL(file)
  }

  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'

  const inputClass = `h-11 rounded-lg pl-10 shadow-none transition-colors ${isEditing ? 'bg-background' : 'border-transparent bg-muted/50'}`

  return (
    <main className="min-h-full bg-muted/20 px-3 py-6 sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <Card className="gap-0 overflow-hidden rounded-2xl border-0 bg-card py-0 shadow-sm ring-1 ring-border">
          <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="relative isolate flex flex-col items-center overflow-hidden border-b border-border/60 bg-brand/5 px-6 py-9 text-center md:border-r md:border-b-0 md:py-12">
              <div aria-hidden="true" className="pointer-events-none absolute -top-28 -left-20 -z-10 size-80 rounded-full border-[40px] border-brand/5" />
              <p className="mb-7 text-[10px] font-semibold tracking-[0.2em] text-brand uppercase">Your account</p>
              <div className="relative">
                <Avatar className="size-28 shadow-lg shadow-brand/15 ring-4 ring-background sm:size-32">
                  <AvatarImage src={avatar} alt={name || 'Profile'} />
                  <AvatarFallback className="bg-brand text-3xl font-semibold text-brand-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <input id="avatar-upload" type="file" accept=".jpg,.jpeg,.png,.svg" className="hidden" onChange={handleAvatarChange} />
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute right-0 bottom-0 size-9 rounded-full border-2 border-background shadow-sm"
                      aria-label="Change profile avatar"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Camera className="size-4" />
                    </Button>
                  </>
                )}
              </div>
              <h2 className="mt-5 w-full text-xl leading-snug font-semibold break-words tracking-tight">{name || 'My Account'}</h2>
              <span className="mt-2 inline-flex max-w-full items-center rounded-full border border-brand/15 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                {displayRole}
              </span>
              {isActive !== null && (
                <div className="mt-7 flex w-full items-center justify-center gap-2 border-t border-brand/10 pt-5 text-xs text-muted-foreground">
                  <span className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <span>{isActive ? 'Active' : 'Inactive'}</span>
                </div>
              )}
            </aside>

            <div className="min-w-0">
              <CardHeader className="flex flex-row items-start justify-between gap-4 rounded-none border-b border-border/60 px-5 py-6 sm:px-8 sm:py-7">
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold tracking-tight">Personal details</CardTitle>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Your name and contact information.
                  </p>
                </div>
                {!isEditing && (
                  <Button type="button" variant="outline" size="sm" className="shrink-0 rounded-lg border-brand/20 text-brand hover:bg-brand/5 hover:text-brand" onClick={() => setIsEditing(true)}>
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                )}
                {isEditing && <span className="shrink-0 rounded-md bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">Editing</span>}
              </CardHeader>

              <CardContent className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
                <div className="space-y-2.5">
                  <Label htmlFor="profile-name" className="text-xs font-medium text-muted-foreground">Full name</Label>
                  <div className="relative">
                    <UserRound aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="profile-name" value={name} readOnly={!isEditing} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="profile-email" className="text-xs font-medium text-muted-foreground">Email address</Label>
                  <div className="relative">
                    <Mail aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="profile-email" type="email" value={emailID} readOnly={!isEditing} onChange={(event) => setEmailID(event.target.value)} placeholder="Enter your email" className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="profile-phone" className="text-xs font-medium text-muted-foreground">Mobile number</Label>
                  <div className="flex gap-2">
                    <select
                      id="country-code"
                      value={mobileCountry}
                      disabled={!isEditing}
                      onChange={(event) => {
                        const country = event.target.value
                        setMobileCountry(country)
                        setCountryCode(`+${getCountryCallingCode(country)}`)
                      }}
                      className={`h-11 w-24 shrink-0 rounded-lg border px-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default disabled:opacity-100 ${isEditing ? 'border-input bg-background' : 'border-transparent bg-muted/50'}`}
                      aria-label="Country code"
                    >
                      <option value="" disabled>{countryCode || 'Code'}</option>
                      {mobileCountries.map(({ country, code }) => (
                        <option key={country} value={country}>{country} {code}</option>
                      ))}
                    </select>
                    <div className="relative min-w-0 flex-1">
                      <Phone aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="profile-phone" type="tel" value={mobileNumber} readOnly={!isEditing} onChange={(event) => setMobileNumber(event.target.value)} placeholder="Mobile number" className={`${inputClass} min-w-0`} />
                    </div>
                  </div>
                </div>
              </CardContent>

              {isEditing && (
                <div className="flex flex-col-reverse gap-3 border-t border-border/60 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
                  <Button type="button" variant="outline" className="rounded-lg sm:min-w-24" onClick={handleCancel}>
                    <X className="size-4" />Cancel
                  </Button>
                  <Button type="button" className="rounded-lg sm:min-w-32" onClick={handleSave}>
                    <Save className="size-4" />Save changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
