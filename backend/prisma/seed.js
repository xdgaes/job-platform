import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const clipper1 = await prisma.user.upsert({
    where: { email: 'clipper1@test.com' },
    update: {},
    create: {
      name: 'Alex Johnson',
      email: 'clipper1@test.com',
      password: await bcrypt.hash('password123', 10),
      currentRole: 'clipper',
    },
  });

  const clipper2 = await prisma.user.upsert({
    where: { email: 'clipper2@test.com' },
    update: {},
    create: {
      name: 'Sarah Williams',
      email: 'clipper2@test.com',
      password: await bcrypt.hash('password123', 10),
      currentRole: 'clipper',
    },
  });

  const clipper3 = await prisma.user.upsert({
    where: { email: 'clipper3@test.com' },
    update: {},
    create: {
      name: 'Mike Chen',
      email: 'clipper3@test.com',
      password: await bcrypt.hash('password123', 10),
      currentRole: 'clipper',
    },
  });

  const creator = await prisma.user.upsert({
    where: { email: 'creator@test.com' },
    update: {},
    create: {
      name: 'Emma Davis',
      email: 'creator@test.com',
      password: await bcrypt.hash('password123', 10),
      currentRole: 'creator',
    },
  });

  console.log('✅ Created test users');

  // Create wallets for all users
  await prisma.wallet.upsert({
    where: { userId: clipper1.id },
    update: {},
    create: {
      userId: clipper1.id,
      balance: 150.50,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: clipper2.id },
    update: {},
    create: {
      userId: clipper2.id,
      balance: 220.75,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: clipper3.id },
    update: {},
    create: {
      userId: clipper3.id,
      balance: 89.25,
    },
  });

  const creatorWallet = await prisma.wallet.upsert({
    where: { userId: creator.id },
    update: {},
    create: {
      userId: creator.id,
      balance: 5000.00,
    },
  });

  console.log('✅ Created wallets');

  // Add some transactions
  await prisma.transaction.createMany({
    data: [
      {
        walletId: creatorWallet.id,
        amount: 5000.00,
        type: 'credit',
        description: 'Initial deposit',
      },
      {
        walletId: creatorWallet.id,
        amount: 150.00,
        type: 'debit',
        description: 'Campaign payment - Summer Launch',
      },
    ],
  });

  console.log('✅ Created transactions');

  // Create connected accounts
  await prisma.connectedAccount.upsert({
    where: {
      userId_platform: {
        userId: creator.id,
        platform: 'youtube',
      },
    },
    update: {},
    create: {
      userId: creator.id,
      platform: 'youtube',
      username: '@emmadavis',
      accountId: 'UC1234567890',
      isActive: true,
    },
  });

  await prisma.connectedAccount.upsert({
    where: {
      userId_platform: {
        userId: creator.id,
        platform: 'instagram',
      },
    },
    update: {},
    create: {
      userId: creator.id,
      platform: 'instagram',
      username: '@emma_creates',
      accountId: 'IG9876543210',
      isActive: true,
    },
  });

  await prisma.connectedAccount.upsert({
    where: {
      userId_platform: {
        userId: clipper1.id,
        platform: 'tiktok',
      },
    },
    update: {},
    create: {
      userId: clipper1.id,
      platform: 'tiktok',
      username: '@alexclips',
      accountId: 'TT5555555555',
      isActive: true,
    },
  });

  console.log('✅ Created connected accounts');

  // Create campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      creatorId: creator.id,
      name: 'Summer Launch Campaign',
      description: 'Promote our new summer product line across all platforms',
      budget: 2000.00,
      totalSpent: 325.50,
      status: 'active',
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      creatorId: creator.id,
      name: 'Fall Collection Teaser',
      description: 'Generate buzz for upcoming fall collection',
      budget: 1500.00,
      totalSpent: 180.00,
      status: 'active',
    },
  });

  console.log('✅ Created campaigns');

  // Create clips for campaign 1
  await prisma.clip.createMany({
    data: [
      {
        campaignId: campaign1.id,
        clipperId: clipper1.id,
        title: 'Summer Vibes - Product Showcase',
        platform: 'youtube',
        videoUrl: 'https://youtube.com/watch?v=example1',
        views: 15000,
        likes: 850,
        shares: 120,
        rewardEarned: 75.00,
      },
      {
        campaignId: campaign1.id,
        clipperId: clipper1.id,
        title: 'Behind the Scenes - Summer Shoot',
        platform: 'instagram',
        videoUrl: 'https://instagram.com/reel/example2',
        views: 8500,
        likes: 620,
        shares: 85,
        rewardEarned: 42.50,
      },
      {
        campaignId: campaign1.id,
        clipperId: clipper2.id,
        title: 'Quick Review - Summer Collection',
        platform: 'tiktok',
        videoUrl: 'https://tiktok.com/@user/video/example3',
        views: 22000,
        likes: 1200,
        shares: 180,
        rewardEarned: 110.00,
      },
      {
        campaignId: campaign1.id,
        clipperId: clipper2.id,
        title: 'Unboxing Summer Package',
        platform: 'youtube',
        videoUrl: 'https://youtube.com/watch?v=example4',
        views: 12000,
        likes: 680,
        shares: 95,
        rewardEarned: 60.00,
      },
      {
        campaignId: campaign1.id,
        clipperId: clipper3.id,
        title: 'Summer Style Guide',
        platform: 'instagram',
        videoUrl: 'https://instagram.com/reel/example5',
        views: 7600,
        likes: 420,
        shares: 65,
        rewardEarned: 38.00,
      },
    ],
  });

  // Create clips for campaign 2
  await prisma.clip.createMany({
    data: [
      {
        campaignId: campaign2.id,
        clipperId: clipper1.id,
        title: 'Fall Sneak Peek',
        platform: 'youtube',
        videoUrl: 'https://youtube.com/watch?v=example6',
        views: 9500,
        likes: 520,
        shares: 75,
        rewardEarned: 47.50,
      },
      {
        campaignId: campaign2.id,
        clipperId: clipper2.id,
        title: 'First Look - Fall Collection',
        platform: 'tiktok',
        videoUrl: 'https://tiktok.com/@user/video/example7',
        views: 18000,
        likes: 950,
        shares: 140,
        rewardEarned: 90.00,
      },
      {
        campaignId: campaign2.id,
        clipperId: clipper3.id,
        title: 'Fall Trends Preview',
        platform: 'instagram',
        videoUrl: 'https://instagram.com/reel/example8',
        views: 8500,
        likes: 470,
        shares: 68,
        rewardEarned: 42.50,
      },
    ],
  });

  console.log('✅ Created clips');

  // Create analytics for campaigns
  const campaign1Clips = await prisma.clip.findMany({
    where: { campaignId: campaign1.id },
  });

  const campaign2Clips = await prisma.clip.findMany({
    where: { campaignId: campaign2.id },
  });

  // Calculate analytics for campaign 1
  const c1TotalViews = campaign1Clips.reduce((sum, c) => sum + c.views, 0);
  const c1TotalLikes = campaign1Clips.reduce((sum, c) => sum + c.likes, 0);
  const c1TotalShares = campaign1Clips.reduce((sum, c) => sum + c.shares, 0);
  const c1YoutubeViews = campaign1Clips.filter(c => c.platform === 'youtube').reduce((sum, c) => sum + c.views, 0);
  const c1InstagramViews = campaign1Clips.filter(c => c.platform === 'instagram').reduce((sum, c) => sum + c.views, 0);
  const c1TiktokViews = campaign1Clips.filter(c => c.platform === 'tiktok').reduce((sum, c) => sum + c.views, 0);
  const c1Clippers = new Set(campaign1Clips.map(c => c.clipperId)).size;
  const c1CPM = (325.50 / c1TotalViews) * 1000;

  await prisma.campaignAnalytics.create({
    data: {
      campaignId: campaign1.id,
      totalViews: c1TotalViews,
      totalLikes: c1TotalLikes,
      totalShares: c1TotalShares,
      totalClippers: c1Clippers,
      youtubeViews: c1YoutubeViews,
      instagramViews: c1InstagramViews,
      tiktokViews: c1TiktokViews,
      cpm: c1CPM,
      demographics: JSON.stringify({
        ageGroups: { '18-24': 35, '25-34': 40, '35-44': 20, '45+': 5 },
        gender: { male: 45, female: 52, other: 3 },
        locations: { US: 60, UK: 15, CA: 10, Other: 15 },
      }),
    },
  });

  // Calculate analytics for campaign 2
  const c2TotalViews = campaign2Clips.reduce((sum, c) => sum + c.views, 0);
  const c2TotalLikes = campaign2Clips.reduce((sum, c) => sum + c.likes, 0);
  const c2TotalShares = campaign2Clips.reduce((sum, c) => sum + c.shares, 0);
  const c2YoutubeViews = campaign2Clips.filter(c => c.platform === 'youtube').reduce((sum, c) => sum + c.views, 0);
  const c2InstagramViews = campaign2Clips.filter(c => c.platform === 'instagram').reduce((sum, c) => sum + c.views, 0);
  const c2TiktokViews = campaign2Clips.filter(c => c.platform === 'tiktok').reduce((sum, c) => sum + c.views, 0);
  const c2Clippers = new Set(campaign2Clips.map(c => c.clipperId)).size;
  const c2CPM = (180.00 / c2TotalViews) * 1000;

  await prisma.campaignAnalytics.create({
    data: {
      campaignId: campaign2.id,
      totalViews: c2TotalViews,
      totalLikes: c2TotalLikes,
      totalShares: c2TotalShares,
      totalClippers: c2Clippers,
      youtubeViews: c2YoutubeViews,
      instagramViews: c2InstagramViews,
      tiktokViews: c2TiktokViews,
      cpm: c2CPM,
      demographics: JSON.stringify({
        ageGroups: { '18-24': 30, '25-34': 45, '35-44': 18, '45+': 7 },
        gender: { male: 48, female: 50, other: 2 },
        locations: { US: 55, UK: 20, CA: 12, Other: 13 },
      }),
    },
  });

  console.log('✅ Created campaign analytics');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📊 Test Data Summary:');
  console.log('- 4 Users (3 clippers, 1 creator)');
  console.log('- 4 Wallets with balances');
  console.log('- 2 Transactions');
  console.log('- 3 Connected accounts (YouTube, Instagram, TikTok)');
  console.log('- 2 Active campaigns');
  console.log('- 8 Clips across platforms');
  console.log('- 2 Campaign analytics records');
  console.log('\n🔐 Test Login Credentials:');
  console.log('Creator: creator@test.com / password123');
  console.log('Clipper 1: clipper1@test.com / password123');
  console.log('Clipper 2: clipper2@test.com / password123');
  console.log('Clipper 3: clipper3@test.com / password123');
  console.log('\n📈 Campaign Statistics:');
  console.log(`Campaign 1: ${c1TotalViews} views, ${c1TotalLikes} likes, ${c1Clippers} clippers, $${c1CPM.toFixed(2)} CPM`);
  console.log(`Campaign 2: ${c2TotalViews} views, ${c2TotalLikes} likes, ${c2Clippers} clippers, $${c2CPM.toFixed(2)} CPM`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
