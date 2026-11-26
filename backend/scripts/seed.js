require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const Enquiry = require('../models/Enquiry');
const SavedProperty = require('../models/SavedProperty');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/renteasy';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB for seeding.');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Enquiry.deleteMany({});
    await SavedProperty.deleteMany({});
    console.log('🗑️  Cleaned previous database records.');

    // 1. Create Users (Admin, Owners, Tenants)
    const adminUser = await User.create({
      name: 'Om Chaurasia (Admin)',
      email: 'admin@renteasy.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 9876543210'
    });

    const owner1 = await User.create({
      name: 'Vikram Sharma (Owner)',
      email: 'owner@renteasy.com',
      password: 'password123',
      role: 'owner',
      phone: '+91 9811223344'
    });

    const owner2 = await User.create({
      name: 'Sunita Rao (Owner)',
      email: 'sunita@renteasy.com',
      password: 'password123',
      role: 'owner',
      phone: '+91 9711889900'
    });

    const tenant1 = await User.create({
      name: 'Rahul Verma (Tenant)',
      email: 'tenant@renteasy.com',
      password: 'password123',
      role: 'tenant',
      phone: '+91 9955443322'
    });

    const tenant2 = await User.create({
      name: 'Priya Mehta (Tenant)',
      email: 'priya@renteasy.com',
      password: 'password123',
      role: 'tenant',
      phone: '+91 9822334455'
    });

    console.log('👥 Created Users: Admin, Owners, Tenants');

    // 2. Create Sample Properties in Gurgaon / NCR (near KR Mangalam University & Cyber City)
    const propertiesData = [
      {
        title: 'Luxury 3 BHK High-Rise Apartment',
        description: 'Spacious 3 bedroom apartment with panoramic views of the city skyline, modular kitchen, wooden flooring in master bedroom, and premium club access.',
        rent: 42000,
        securityDeposit: 84000,
        location: {
          area: 'Golf Course Road',
          city: 'Gurugram',
          state: 'Haryana',
          address: 'Tower B, The Grand Arch, Sector 58',
          zipCode: '122102'
        },
        propertyType: 'Apartment',
        bedrooms: 3,
        bathrooms: 3,
        furnishingStatus: 'Fully Furnished',
        amenities: ['Gym', 'Swimming Pool', '24/7 Power Backup', 'Covered Parking', 'Security Guard', 'Clubhouse', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
        ],
        owner: owner1._id,
        status: 'approved'
      },
      {
        title: 'Cozy 2 BHK Near KR Mangalam Campus',
        description: 'Well-ventilated 2 BHK apartment located on Sohna Road, very close to KR Mangalam University, IT parks, and shopping malls. Ideal for students and young professionals.',
        rent: 24000,
        securityDeposit: 48000,
        location: {
          area: 'Sohna Road',
          city: 'Gurugram',
          state: 'Haryana',
          address: 'Flat 402, Green Valley Heights, Badshahpur',
          zipCode: '122101'
        },
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        furnishingStatus: 'Semi Furnished',
        amenities: ['24/7 Power Backup', 'Lift', 'Security Guard', 'Two-Wheeler Parking', 'Wi-Fi Ready', 'Geyser'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
        ],
        owner: owner1._id,
        status: 'approved'
      },
      {
        title: 'Modern Studio Apartment for Techies',
        description: 'Ultra-modern studio flat with smart home lighting, high-speed fiber internet, compact kitchenette, and walking distance to rapid metro station.',
        rent: 18500,
        securityDeposit: 37000,
        location: {
          area: 'Cyber City',
          city: 'Gurugram',
          state: 'Haryana',
          address: 'A-22, DLF Phase 2, Near Cyber Hub',
          zipCode: '122002'
        },
        propertyType: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        furnishingStatus: 'Fully Furnished',
        amenities: ['High Speed Wi-Fi', 'Air Conditioner', 'Power Backup', 'Smart TV', 'Microwave', 'Cleaning Service'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1502005229762-ee1afd556a31?auto=format&fit=crop&w=1000&q=80'
        ],
        owner: owner2._id,
        status: 'approved'
      },
      {
        title: 'Spacious 4 BHK Independent Villa',
        description: 'Magnificent independent duplex villa with private lawn, terrace garden, modular kitchen, servant quarters, and ample parking space for 3 cars.',
        rent: 68000,
        securityDeposit: 136000,
        location: {
          area: 'Golf Course Road',
          city: 'Gurugram',
          state: 'Haryana',
          address: 'Villa 14, Sunbreeze Enclave, Sector 54',
          zipCode: '122011'
        },
        propertyType: 'Villa',
        bedrooms: 4,
        bathrooms: 4,
        furnishingStatus: 'Semi Furnished',
        amenities: ['Private Garden', 'Terrace', 'Car Parking', '24/7 Water', 'Modular Kitchen', 'Servant Room', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'
        ],
        owner: owner2._id,
        status: 'approved'
      },
      {
        title: 'Affordable 1 BHK Flat in Sector 56',
        description: 'Peaceful 1 BHK home with easy access to Huda City Centre metro, grocery markets, parks, and dining spots.',
        rent: 14000,
        securityDeposit: 28000,
        location: {
          area: 'Sector 56',
          city: 'Gurugram',
          state: 'Haryana',
          address: 'House No 120, Sector 56 HUDA Colony',
          zipCode: '122011'
        },
        propertyType: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        furnishingStatus: 'Semi Furnished',
        amenities: ['Balcony', 'Geyser', 'Two-Wheeler Parking', 'Security', 'Water Purifier'],
        images: [
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80'
        ],
        owner: owner1._id,
        status: 'approved'
      },
      {
        title: 'Co-Living Deluxe Room for Students',
        description: 'Single occupancy private room in a premium co-living property with 3 meals included, daily housekeeping, laundry, and study desk.',
        rent: 12500,
        securityDeposit: 12500,
        location: {
          area: 'Sohna Road',
          city: 'Gurugram',
          state: 'Haryana',
          address: 'Co-Living Nest, Near KR Mangalam Main Gate, Sohna Road',
          zipCode: '122103'
        },
        propertyType: 'PG / Co-living',
        bedrooms: 1,
        bathrooms: 1,
        furnishingStatus: 'Fully Furnished',
        amenities: ['3 Meals Included', 'Wi-Fi', 'Air Conditioner', 'Daily Housekeeping', 'Study Table', 'Laundry Facility'],
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'
        ],
        owner: owner2._id,
        status: 'approved'
      },
      {
        title: 'Pending Listing: 2 BHK Garden Facing Flat',
        description: 'Freshly renovated 2 BHK flat currently waiting for admin review and approval before becoming visible on the public listings portal.',
        rent: 28000,
        securityDeposit: 56000,
        location: {
          area: 'MG Road',
          city: 'Gurugram',
          state: 'Haryana',
          address: 'Heritage City, MG Road',
          zipCode: '122002'
        },
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        furnishingStatus: 'Fully Furnished',
        amenities: ['Gym', 'Swimming Pool', 'Security Guard', 'Covered Parking'],
        images: [
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80'
        ],
        owner: owner1._id,
        status: 'pending' // For testing Admin Approval feature!
      }
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log(`🏡 Created ${createdProperties.length} Properties (including approved & pending approval)`);

    // 3. Create Sample Enquiries & Visit Requests
    await Enquiry.create([
      {
        property: createdProperties[0]._id,
        tenant: tenant1._id,
        owner: owner1._id,
        message: 'Hello, I am interested in this 3 BHK flat. Can I schedule an in-person visit this Saturday?',
        visitDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
        phone: '+91 9955443322',
        status: 'accepted',
        ownerNotes: 'Confirmed visit for Saturday 4:00 PM. Please call upon arrival.'
      },
      {
        property: createdProperties[1]._id,
        tenant: tenant2._id,
        owner: owner1._id,
        message: 'Hi Mr. Sharma, does this property have covered car parking? Would like to view it tomorrow.',
        visitDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        phone: '+91 9822334455',
        status: 'pending'
      }
    ]);
    console.log('📩 Created Sample Enquiries & Visit Requests');

    // 4. Create Sample Saved Properties
    await SavedProperty.create([
      { tenant: tenant1._id, property: createdProperties[0]._id },
      { tenant: tenant1._id, property: createdProperties[1]._id },
      { tenant: tenant2._id, property: createdProperties[2]._id }
    ]);
    console.log('⭐ Created Sample Saved Properties for Tenants');

    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Project: RentEasy – Property Rental Listing');
    console.log('Student: Om Chaurasia | Roll No: 2501010063 | KR Mangalam University');
    console.log('Demo Credentials:');
    console.log('  👑 Admin : admin@renteasy.com / password123');
    console.log('  🏢 Owner : owner@renteasy.com / password123');
    console.log('  🏠 Tenant: tenant@renteasy.com / password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
