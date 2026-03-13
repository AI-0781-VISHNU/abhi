require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const organs = [
    {
      name: 'Breast',
      normalCellType: 'Mammary epithelial cells',
      cancerType: 'Breast Cancer',
      description: 'The breast tissue contains milk-producing glands (lobules) and ducts that carry milk to the nipple.',
      metrics: {
        create: [
          { isCancer: false, avgArea: 450, avgNuclearArea: 50, avgPerimeter: 80, avgCircularity: 0.85, avgDensity: 120 },
          { isCancer: true, avgArea: 850, avgNuclearArea: 250, avgPerimeter: 150, avgCircularity: 0.45, avgDensity: 450 }
        ]
      },
      images: {
        create: [
          { url: '/images/breast_normal.png', isCancer: false, label: 'Normal Mammary Tissue' },
          { url: '/images/breast_cancer.png', isCancer: true, label: 'Invasive Ductal Carcinoma' }
        ]
      }
    },
    {
      name: 'Lung',
      normalCellType: 'Alveolar epithelial cells',
      cancerType: 'Lung Cancer',
      description: 'Lungs are spongy organs responsible for gas exchange between the air we breathe and our blood.',
      metrics: {
        create: [
          { isCancer: false, avgArea: 400, avgNuclearArea: 45, avgPerimeter: 75, avgCircularity: 0.82, avgDensity: 100 },
          { isCancer: true, avgArea: 780, avgNuclearArea: 210, avgPerimeter: 140, avgCircularity: 0.48, avgDensity: 410 }
        ]
      },
      images: {
        create: [
          { url: '/images/lung_normal.png', isCancer: false, label: 'Normal Alveolar Structure' },
          { url: '/images/lung_cancer.png', isCancer: true, label: 'Lung Adenocarcinoma' }
        ]
      }
    },
    {
      name: 'Liver',
      normalCellType: 'Hepatocytes',
      cancerType: 'Hepatocellular Carcinoma',
      description: 'The liver is a vital organ that performs many functions including detoxification and protein synthesis.',
      metrics: {
        create: [
          { isCancer: false, avgArea: 1200, avgNuclearArea: 120, avgPerimeter: 130, avgCircularity: 0.90, avgDensity: 80 },
          { isCancer: true, avgArea: 2100, avgNuclearArea: 480, avgPerimeter: 220, avgCircularity: 0.55, avgDensity: 320 }
        ]
      },
      images: {
        create: [
          { url: '/images/liver_normal.png', isCancer: false, label: 'Healthy Hepatocytes' },
          { url: '/images/liver_cancer.png', isCancer: true, label: 'Hepatocellular Carcinoma' }
        ]
      }
    },
    {
      name: 'Skin',
      normalCellType: 'Melanocytes / epithelial cells',
      cancerType: 'Melanoma',
      description: 'The skin is the largest organ of the body, protecting against heat, light, injury, and infection.',
      metrics: {
        create: [
          { isCancer: false, avgArea: 350, avgNuclearArea: 40, avgPerimeter: 70, avgCircularity: 0.88, avgDensity: 150 },
          { isCancer: true, avgArea: 720, avgNuclearArea: 190, avgPerimeter: 130, avgCircularity: 0.42, avgDensity: 520 }
        ]
      },
      images: {
        create: [
          { url: '/images/skin_normal.png', isCancer: false, label: 'Normal Epidermis' },
          { url: '/images/skin_cancer.png', isCancer: true, label: 'Malignant Melanoma' }
        ]
      }
    },
    {
      name: 'Colon',
      normalCellType: 'Colon epithelial cells',
      cancerType: 'Colorectal Cancer',
      description: 'The colon is part of the large intestine, responsible for water absorption and waste transportation.',
      metrics: {
        create: [
          { isCancer: false, avgArea: 550, avgNuclearArea: 60, avgPerimeter: 90, avgCircularity: 0.84, avgDensity: 140 },
          { isCancer: true, avgArea: 980, avgNuclearArea: 310, avgPerimeter: 180, avgCircularity: 0.38, avgDensity: 580 }
        ]
      },
      images: {
        create: [
          { url: '/images/colon_normal.png', isCancer: false, label: 'Normal Colon Mucosa' },
          { url: '/images/colon_cancer.png', isCancer: true, label: 'Colorectal Adenocarcinoma' }
        ]
      }
    },
    {
      name: 'Kidney',
      normalCellType: 'Renal tubule cells',
      cancerType: 'Renal Cell Carcinoma',
      description: 'The kidneys are bean-shaped organs that filter waste products from the blood and produce urine.',
      metrics: {
        create: [
          { isCancer: false, avgArea: 600, avgNuclearArea: 65, avgPerimeter: 95, avgCircularity: 0.86, avgDensity: 110 },
          { isCancer: true, avgArea: 1100, avgNuclearArea: 350, avgPerimeter: 190, avgCircularity: 0.40, avgDensity: 540 }
        ]
      },
      images: {
        create: [
          { url: '/images/kidney_normal.png', isCancer: false, label: 'Normal Renal Tubules' },
          { url: '/images/kidney_cancer.png', isCancer: true, label: 'Renal Cell Carcinoma' }
        ]
      }
    }
  ]

  for (const organData of organs) {
    await prisma.organ.upsert({
      where: { name: organData.name },
      update: {},
      create: organData,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
