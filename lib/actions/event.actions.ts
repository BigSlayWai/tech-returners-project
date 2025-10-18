'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types'

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase()

    const organizer = await User.findById(userId)
    if (!organizer) throw new Error('Organizer not found')

    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
    revalidatePath(path)

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase()

    const event = await populateEvent(Event.findById(eventId))

    if (!event) throw new Error('Event not found')

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()

    const eventToUpdate = await Event.findById(event._id)
    
    // Debug the values being compared
    console.log('Event to update:', eventToUpdate ? 'found' : 'not found')
    console.log('Organizer ID (from event):', eventToUpdate?.organizer)
    console.log('User ID (from params):', userId)
    
    // Check if organizer exists and convert to string for comparison
    const organizerId = eventToUpdate?.organizer?.toString()
    console.log('Organizer ID as string:', organizerId)
    console.log('IDs match?', organizerId === userId)
    
    if (!eventToUpdate || organizerId !== userId) {
      // If there's a mismatch, it might be a Clerk ID vs MongoDB ID issue
      // Let's check if the userId is a Clerk ID and find the corresponding MongoDB user
      const mongoUser = await User.findOne({ clerkId: userId })
      
      if (mongoUser && eventToUpdate?.organizer.toString() === mongoUser._id.toString()) {
        console.log('Match found via Clerk ID lookup!')
        // Found a match - continue with the update using the mongoUser ID
      } else {
        throw new Error('Unauthorized or event not found')
      }
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )
    
    // Populate the updated event before returning
    const populatedEvent = await populateEvent(Event.findById(updatedEvent._id))
    
    revalidatePath(path)

    return JSON.parse(JSON.stringify(populatedEvent))
  } catch (error) {
    console.error('Update error:', error)
    handleError(error)
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
    }

    const skipAmount = (Number(page) - 1) * limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    // Find MongoDB user ID if userId is a Clerk ID
    let mongoUserId = userId
    if (userId.startsWith('user_')) {
      const user = await User.findOne({ clerkId: userId })
      if (user) {
        mongoUserId = user._id
      }
    }

    // Calculate pagination
    const skipAmount = (page - 1) * limit
    const conditions = { organizer: mongoUserId }

    // Create pagination conditions
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate('category organizer')

    const events = await eventsQuery.exec()
    const eventsCount = await Event.countDocuments(conditions)

    const totalPages = Math.ceil(eventsCount / limit)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages,
    }
  } catch (error) {
    console.error('Error getting events by user:', error)
    return {
      data: [],
      totalPages: 0
    }
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}