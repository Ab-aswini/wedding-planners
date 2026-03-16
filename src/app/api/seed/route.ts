import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * DEV ONLY: Seeds demo data for the current logged-in user.
 * POST /api/seed
 *
 * Creates: org, org_member, 2 invites with events, and sample RSVPs.
 * Templates must already exist (run supabase/seed.sql first).
 */
export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated. Sign up first, then call this endpoint.' }, { status: 401 })
  }

  // Check if user already has an org
  const { data: existingMember } = await supabase
    .from('org_members')
    .select('org_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  let orgId: string

  if (existingMember) {
    orgId = existingMember.org_id
  } else {
    // Create demo org
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .insert({
        name: 'Royal Wedding Planners',
        slug: 'royal-wedding-planners-demo',
        owner_id: user.id,
        plan: 'pro',
        invite_limit: 999,
        brand_color: '#B8860B',
      })
      .select('id')
      .single()

    if (orgErr || !org) {
      return NextResponse.json({ error: `Org creation failed: ${orgErr?.message}` }, { status: 500 })
    }

    orgId = org.id

    // Add user as owner
    await supabase.from('org_members').insert({
      org_id: orgId,
      user_id: user.id,
      role: 'owner',
    })
  }

  // Get templates
  const { data: templates } = await supabase
    .from('templates')
    .select('id, slug')
    .limit(5)

  if (!templates || templates.length === 0) {
    return NextResponse.json({
      error: 'No templates found. Run supabase/seed.sql in the Supabase SQL Editor first to seed templates.',
    }, { status: 400 })
  }

  const cityTemplate = templates.find((t) => t.slug === 'city') || templates[0]
  const beachTemplate = templates.find((t) => t.slug === 'beach') || templates[0]

  // ---- Invite 1: Published Hindu wedding ----
  const { data: invite1, error: inv1Err } = await supabase
    .from('invites')
    .insert({
      org_id: orgId,
      template_id: cityTemplate.id,
      created_by: user.id,
      slug: 'rahul-weds-priya-demo',
      status: 'published',
      groom_name: 'Rahul Sharma',
      bride_name: 'Priya Patel',
      groom_family: 'Son of Mr. Anil & Mrs. Sunita Sharma',
      bride_family: 'Daughter of Mr. Vijay & Mrs. Meena Patel',
      wedding_date: '2026-12-15',
      hashtag: 'RahulWedsPrivya',
      religion: 'hindu',
      mantra: 'ॐ गणेशाय नमः',
      deity_motif: 'ganesha',
      story_how: 'We met at a friend\'s Diwali party in 2022. Rahul spilled chai on Priya\'s new saree — and spent the rest of the evening apologizing and making her laugh.',
      story_proposal: 'On a trip to Udaipur, Rahul arranged a private boat ride on Lake Pichola at sunset. As the palaces glowed gold, he got down on one knee with his grandmother\'s ring.',
      story_motto: 'Two souls, one journey. From chai spills to forever.',
      photos: [],
      hero_photo: '',
      music_url: '',
      color_overrides: '{"primary": "#8B2635", "accent": "#B8860B", "background": "#1a0a0a", "text": "#F5E6D0"}',
      font_overrides: '{"heading": "Playfair Display", "body": "Cormorant Garamond"}',
      dress_code: 'Traditional Indian attire. Groom side: Maroon & Gold. Bride side: Teal & Pink.',
      parking_info: 'Valet parking available at the main entrance. Self-parking in Lot B.',
      accommodation: 'Rooms blocked at The Grand Palace Hotel. Use code RAHULPRIYA for 20% off.',
      show_rsvp: true,
      show_countdown: true,
      show_gallery: true,
      show_story: true,
      show_music: true,
      view_count: 247,
      published_at: '2026-03-10T10:00:00Z',
    })
    .select('id')
    .single()

  if (inv1Err) {
    return NextResponse.json({ error: `Invite 1 failed: ${inv1Err.message}` }, { status: 500 })
  }

  // Events for Invite 1
  await supabase.from('events').insert([
    {
      invite_id: invite1!.id,
      name: 'Mehndi',
      date: '2026-12-13',
      time_text: '4:00 PM onwards',
      venue_name: 'Sharma Residence',
      venue_city: 'Jaipur',
      map_link: '',
      accent_color: '#DAA520',
      sort_order: 0,
      is_private: false,
      guest_group: 'all',
    },
    {
      invite_id: invite1!.id,
      name: 'Sangeet',
      date: '2026-12-14',
      time_text: '7:00 PM - 12:00 AM',
      venue_name: 'The Grand Palace Banquet Hall',
      venue_city: 'Jaipur',
      map_link: '',
      accent_color: '#C71585',
      sort_order: 1,
      is_private: false,
      guest_group: 'all',
    },
    {
      invite_id: invite1!.id,
      name: 'Wedding Ceremony',
      date: '2026-12-15',
      time_text: '10:00 AM (Muhurat: 11:32 AM)',
      venue_name: 'Jai Mahal Palace',
      venue_city: 'Jaipur',
      map_link: '',
      accent_color: '#8B2635',
      sort_order: 2,
      is_private: false,
      guest_group: 'all',
    },
    {
      invite_id: invite1!.id,
      name: 'Reception',
      date: '2026-12-15',
      time_text: '7:00 PM onwards',
      venue_name: 'Jai Mahal Palace — Grand Lawn',
      venue_city: 'Jaipur',
      map_link: '',
      accent_color: '#B8860B',
      sort_order: 3,
      is_private: false,
      guest_group: 'all',
    },
  ])

  // Sample RSVPs for Invite 1
  await supabase.from('rsvps').insert([
    { invite_id: invite1!.id, guest_name: 'Amit & Neha Verma', attending: true, guest_count: 4, message: 'So happy for you both! We\'ll be there with the kids!', phone: '+91 98765 43210' },
    { invite_id: invite1!.id, guest_name: 'Sneha Iyer', attending: true, guest_count: 2, message: 'Congratulations! Can\'t wait to dance at the Sangeet!', phone: '+91 87654 32109' },
    { invite_id: invite1!.id, guest_name: 'Rohan Kapoor', attending: true, guest_count: 1, message: 'Wouldn\'t miss it for the world, brother!', phone: '' },
    { invite_id: invite1!.id, guest_name: 'Divya Nair', attending: false, guest_count: 1, message: 'So sorry we can\'t make it — will be traveling. Sending all our love!', phone: '+91 76543 21098' },
    { invite_id: invite1!.id, guest_name: 'Arjun & Meera Singh', attending: true, guest_count: 3, message: 'Booked our flights already! See you in Jaipur!', phone: '+91 65432 10987' },
    { invite_id: invite1!.id, guest_name: 'Pooja Deshmukh', attending: true, guest_count: 2, message: 'Beautiful invite! Love the design. See you there.', phone: '' },
    { invite_id: invite1!.id, guest_name: 'Kiran Reddy', attending: false, guest_count: 1, message: 'Have a work commitment. Wishing you both the best!', phone: '+91 54321 09876' },
  ])

  // ---- Invite 2: Draft wedding ----
  const { data: invite2 } = await supabase
    .from('invites')
    .insert({
      org_id: orgId,
      template_id: beachTemplate.id,
      created_by: user.id,
      slug: 'arjun-and-meera-demo',
      status: 'draft',
      groom_name: 'Arjun Reddy',
      bride_name: 'Meera Krishnan',
      groom_family: '',
      bride_family: '',
      wedding_date: '2027-02-14',
      hashtag: 'ArjunMeera2027',
      religion: 'universal',
      mantra: '',
      deity_motif: 'none',
      color_overrides: '{"primary": "#1a6b7a", "accent": "#e8a87c", "background": "#fdf6ee", "text": "#2d3436"}',
      font_overrides: '{"heading": "Yeseva One", "body": "Josefin Sans"}',
      show_rsvp: true,
      show_countdown: true,
      show_gallery: true,
      show_story: false,
      show_music: false,
      view_count: 0,
    })
    .select('id')
    .single()

  if (invite2) {
    await supabase.from('events').insert([
      {
        invite_id: invite2.id,
        name: 'Wedding Ceremony',
        date: '2027-02-14',
        time_text: '5:00 PM',
        venue_name: 'Taj Exotica Beach Resort',
        venue_city: 'Goa',
        sort_order: 0,
      },
      {
        invite_id: invite2.id,
        name: 'Reception & Dinner',
        date: '2027-02-14',
        time_text: '7:30 PM onwards',
        venue_name: 'Taj Exotica — Beachfront Lawn',
        venue_city: 'Goa',
        sort_order: 1,
      },
    ])
  }

  return NextResponse.json({
    ok: true,
    message: 'Demo data seeded successfully!',
    data: {
      orgId,
      invites: [
        { id: invite1?.id, slug: 'rahul-weds-priya-demo', status: 'published' },
        { id: invite2?.id, slug: 'arjun-and-meera-demo', status: 'draft' },
      ],
      publishedInviteUrl: '/i/rahul-weds-priya-demo',
    },
  })
}
