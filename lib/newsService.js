// lib/newsService.js
import { 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter, 
    Timestamp, 
    increment 
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Mock data for development
  const MOCK_NEWS = [
    {
      id: '1',
      title: 'New Computer Lab Inauguration',
      slug: 'new-computer-lab-inauguration',
      excerpt: 'MITRA proudly inaugurated a new state-of-the-art computer lab at Sandeepani Gyan Kunj School.',
      content: 'MITRA proudly inaugurated a new state-of-the-art computer lab at Sandeepani Gyan Kunj School. The lab features 20 new computers, high-speed internet, and educational software to help students develop essential digital skills. This initiative was made possible through the generous support of our donors and corporate partners. The inauguration ceremony was attended by local officials, school staff, and excited students who are eager to enhance their learning through technology.',
      image: '/images/news/computer-lab.jpg',
      publishDate: new Date(2024, 9, 15),
      category: 'School Updates',
      likes: 24,
      featured: true,
      viewCount: 156
    },
    {
      id: '2',
      title: 'Annual Cultural Festival "Sanskriti 2024"',
      slug: 'annual-cultural-festival-sanskriti-2024',
      excerpt: 'Join us for our annual cultural celebration featuring performances by our talented students.',
      content: 'Join us for our annual cultural celebration featuring performances by our talented students. Sanskriti 2024 will showcase traditional dances, music performances, drama, and art exhibitions created by students of all ages. The event will take place on November 20th from 4 PM to 8 PM at the school premises. Parents, community members, and supporters are all welcome to attend this joyous celebration of culture and creativity.',
      image: '/images/news/cultural-festival.jpg',
      publishDate: new Date(2024, 9, 10),
      category: 'Events',
      likes: 18,
      featured: false,
      viewCount: 89
    },
    {
      id: '3',
      title: 'Teacher Training Workshop',
      slug: 'teacher-training-workshop',
      excerpt: 'MITRA organized a 3-day training workshop for teachers focusing on innovative teaching methodologies.',
      content: 'MITRA organized a 3-day training workshop for teachers focusing on innovative teaching methodologies. The workshop, led by education experts from urban schools, covered topics such as activity-based learning, integration of technology in classroom teaching, and addressing diverse learning needs. Our 15 teachers participated enthusiastically, gaining valuable insights to enhance their teaching practices. This initiative is part of our ongoing commitment to improving the quality of education at our school.',
      image: '/images/news/teacher-workshop.jpg',
      publishDate: new Date(2024, 9, 5),
      category: 'Training',
      likes: 12,
      featured: false,
      viewCount: 67
    },
    {
      id: '4',
      title: 'Community Health Camp Success',
      slug: 'community-health-camp-success',
      excerpt: 'MITRA organized a free health camp for the community, benefiting over 200 villagers.',
      content: 'MITRA organized a free health camp for the community, benefiting over 200 villagers. The camp provided general health check-ups, eye examinations, dental care, and awareness sessions on preventive healthcare. Medical professionals from the district hospital volunteered their time and expertise for this initiative. Many villagers who rarely have access to healthcare services were able to receive medical attention and advice. We extend our heartfelt thanks to all the doctors, nurses, and volunteers who made this event possible.',
      image: '/images/news/health-camp.jpg',
      publishDate: new Date(2024, 8, 28),
      category: 'Community Outreach',
      likes: 31,
      featured: false,
      viewCount: 103
    },
    {
      id: '5',
      title: 'New Scholarship Program for Girls',
      slug: 'new-scholarship-program-for-girls',
      excerpt: 'MITRA launches a new scholarship program aimed at supporting the education of girls from underprivileged backgrounds.',
      content: 'MITRA launches a new scholarship program aimed at supporting the education of girls from underprivileged backgrounds. The program will cover school fees, books, uniforms, and other educational expenses for 50 deserving girls each year. This initiative is part of our commitment to promoting gender equality and ensuring that financial constraints do not prevent girls from accessing quality education. The selection process will begin next month, with scholarships being awarded based on both merit and need.',
      image: '/images/news/scholarship-program.jpg',
      publishDate: new Date(2024, 8, 20),
      category: 'Education',
      likes: 45,
      featured: false,
      viewCount: 127
    },
    {
      id: '6',
      title: 'Environmental Awareness Drive',
      slug: 'environmental-awareness-drive',
      excerpt: 'Students from Sandeepani Gyan Kunj led an environmental awareness campaign in the community.',
      content: 'Students from Sandeepani Gyan Kunj led an environmental awareness campaign in the community. The drive included tree planting, a cleanliness drive, and educational sessions on waste management and conservation. Our students actively engaged with community members, distributing informational pamphlets and demonstrating eco-friendly practices. The initiative was well-received by the villagers, with many expressing interest in adopting more sustainable habits. We are proud of our students for taking this initiative and becoming agents of positive change in their community.',
      image: '/images/news/environmental-drive.jpg',
      publishDate: new Date(2024, 8, 10),
      category: 'Environment',
      likes: 27,
      featured: false,
      viewCount: 84
    },
    {
      id: '7',
      title: 'Sports Day Celebration',
      slug: 'sports-day-celebration',
      excerpt: 'Sandeepani Gyan Kunj School held its annual Sports Day with enthusiastic participation from students across all grades.',
      content: 'Sandeepani Gyan Kunj School held its annual Sports Day with enthusiastic participation from students across all grades. The event featured track and field competitions, team sports, and fun activities for students of all abilities. Parents and community members attended in large numbers to cheer for the young athletes. The day highlighted the importance of physical activity and sportsmanship in a child\'s development. Medals and certificates were awarded to winners and participants, celebrating both achievement and effort.',
      image: '/images/news/sports-day.jpg',
      publishDate: new Date(2024, 7, 25),
      category: 'School Events',
      likes: 33,
      featured: false,
      viewCount: 112
    },
    {
      id: '8',
      title: 'Vocational Training for Youth',
      slug: 'vocational-training-for-youth',
      excerpt: 'MITRA launches a new vocational training program for unemployed youth in the community.',
      content: 'MITRA launches a new vocational training program for unemployed youth in the community. The program offers courses in computer skills, tailoring, electrical work, and mobile phone repair. By equipping young people with marketable skills, we aim to enhance their employability and support their journey toward financial independence. The three-month courses are provided at minimal cost, with scholarships available for those in need. Registrations are now open, with classes scheduled to begin next month.',
      image: '/images/news/vocational-training.jpg',
      publishDate: new Date(2024, 7, 15),
      category: 'Skill Development',
      likes: 29,
      featured: false,
      viewCount: 95
    }
  ];
  
  // Helper to clone and sanitize the mock data
  const cloneMockData = (data) => {
    return JSON.parse(JSON.stringify(data)).map(item => ({
      ...item,
      publishDate: new Date(item.publishDate)
    }));
  };
  
  export const newsService = {
    // Get all news items
    getAllNews: async () => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          return cloneMockData(MOCK_NEWS);
        }
        
        // In production, use Firestore
        const querySnapshot = await getDocs(
          query(collection(db, 'news'), orderBy('publishDate', 'desc'))
        );
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishDate: doc.data().publishDate?.toDate() // Convert Firestore timestamp to JS Date
        }));
      } catch (error) {
        console.error('Error getting news:', error);
        // Fallback to mock data if there's an error
        return cloneMockData(MOCK_NEWS);
      }
    },
    
    // Get paginated news
    getPaginatedNews: async (lastVisible = null, itemsPerPage = 10) => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          const mockData = cloneMockData(MOCK_NEWS);
          mockData.sort((a, b) => b.publishDate - a.publishDate);
          
          const startIndex = lastVisible ? MOCK_NEWS.findIndex(item => item.id === lastVisible.id) + 1 : 0;
          const endIndex = startIndex + itemsPerPage;
          const paginatedNews = mockData.slice(startIndex, endIndex);
          const lastDoc = paginatedNews.length > 0 ? paginatedNews[paginatedNews.length - 1] : null;
          
          return { news: paginatedNews, lastDoc };
        }
        
        // In production, use Firestore
        let newsQuery;
        
        if (lastVisible) {
          newsQuery = query(
            collection(db, 'news'),
            orderBy('publishDate', 'desc'),
            startAfter(lastVisible),
            limit(itemsPerPage)
          );
        } else {
          newsQuery = query(
            collection(db, 'news'),
            orderBy('publishDate', 'desc'),
            limit(itemsPerPage)
          );
        }
        
        const querySnapshot = await getDocs(newsQuery);
        
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        const news = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishDate: doc.data().publishDate?.toDate()
        }));
        
        return { news, lastDoc };
      } catch (error) {
        console.error('Error getting paginated news:', error);
        // Fallback to mock data if there's an error
        const mockData = cloneMockData(MOCK_NEWS);
        mockData.sort((a, b) => b.publishDate - a.publishDate);
        
        const paginatedNews = mockData.slice(0, itemsPerPage);
        const lastDoc = paginatedNews.length > 0 ? paginatedNews[paginatedNews.length - 1] : null;
        
        return { news: paginatedNews, lastDoc };
      }
    },
    
    // Get news by category
    getNewsByCategory: async (category) => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          const mockData = cloneMockData(MOCK_NEWS);
          return mockData
            .filter(item => item.category === category)
            .sort((a, b) => b.publishDate - a.publishDate);
        }
        
        // In production, use Firestore
        const querySnapshot = await getDocs(
          query(
            collection(db, 'news'),
            where('category', '==', category),
            orderBy('publishDate', 'desc')
          )
        );
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishDate: doc.data().publishDate?.toDate()
        }));
      } catch (error) {
        console.error('Error getting news by category:', error);
        // Fallback to mock data if there's an error
        const mockData = cloneMockData(MOCK_NEWS);
        return mockData
          .filter(item => item.category === category)
          .sort((a, b) => b.publishDate - a.publishDate);
      }
    },
    
    // Get featured news
    getFeaturedNews: async () => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          const mockData = cloneMockData(MOCK_NEWS);
          return mockData.find(item => item.featured) || mockData[0];
        }
        
        // In production, use Firestore
        const querySnapshot = await getDocs(
          query(
            collection(db, 'news'),
            where('featured', '==', true),
            orderBy('publishDate', 'desc'),
            limit(1)
          )
        );
        
        const featuredNews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishDate: doc.data().publishDate?.toDate()
        }));
        
        return featuredNews[0] || null;
      } catch (error) {
        console.error('Error getting featured news:', error);
        // Fallback to mock data if there's an error
        const mockData = cloneMockData(MOCK_NEWS);
        return mockData.find(item => item.featured) || mockData[0];
      }
    },
    
    // Get news by ID
    getNewsById: async (id) => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          const mockData = cloneMockData(MOCK_NEWS);
          return mockData.find(item => item.id === id) || null;
        }
        
        // In production, use Firestore
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            publishDate: data.publishDate?.toDate()
          };
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error getting news by ID:', error);
        // Fallback to mock data if there's an error
        const mockData = cloneMockData(MOCK_NEWS);
        return mockData.find(item => item.id === id) || null;
      }
    },
    
    // Get news by slug
    getNewsBySlug: async (slug) => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          const mockData = cloneMockData(MOCK_NEWS);
          return mockData.find(item => item.slug === slug) || null;
        }
        
        // In production, use Firestore
        const querySnapshot = await getDocs(
          query(
            collection(db, 'news'),
            where('slug', '==', slug)
          )
        );
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          
          return {
            id: doc.id,
            ...data,
            publishDate: data.publishDate?.toDate()
          };
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error getting news by slug:', error);
        // Fallback to mock data if there's an error
        const mockData = cloneMockData(MOCK_NEWS);
        return mockData.find(item => item.slug === slug) || null;
      }
    },
    
    // Create news
    createNews: async (newsData) => {
      try {
        // In development, simulate API call
        if (isDevelopment) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newId = (MOCK_NEWS.length + 1).toString();
          const formattedData = {
            ...newsData,
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            likes: 0,
            viewCount: 0
          };
          
          MOCK_NEWS.push(formattedData);
          return formattedData;
        }
        
        // In production, use Firestore
        const formattedData = {
          ...newsData,
          publishDate: Timestamp.fromDate(new Date(newsData.publishDate || new Date())),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          likes: 0,
          viewCount: 0
        };
        
        const docRef = await addDoc(collection(db, 'news'), formattedData);
        return {
          id: docRef.id,
          ...formattedData,
          publishDate: formattedData.publishDate.toDate()
        };
      } catch (error) {
        console.error('Error creating news:', error);
        throw error;
      }
    },
    
    // Update news
    updateNews: async (id, newsData) => {
      try {
        // In development, simulate API call
        if (isDevelopment) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const index = MOCK_NEWS.findIndex(item => item.id === id);
          if (index !== -1) {
            const updatedData = {
              ...MOCK_NEWS[index],
              ...newsData,
              updatedAt: new Date()
            };
            
            MOCK_NEWS[index] = updatedData;
            return updatedData;
          }
          
          throw new Error('News item not found');
        }
        
        // In production, use Firestore
        const docRef = doc(db, 'news', id);
        
        const formattedData = {
          ...newsData,
          publishDate: newsData.publishDate instanceof Date 
            ? Timestamp.fromDate(newsData.publishDate) 
            : Timestamp.fromDate(new Date(newsData.publishDate)),
          updatedAt: Timestamp.now()
        };
        
        await updateDoc(docRef, formattedData);
        
        return {
          id,
          ...formattedData,
          publishDate: formattedData.publishDate.toDate()
        };
      } catch (error) {
        console.error('Error updating news:', error);
        throw error;
      }
    },
    
    // Delete news
    deleteNews: async (id) => {
      try {
        // In development, simulate API call
        if (isDevelopment) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const index = MOCK_NEWS.findIndex(item => item.id === id);
          if (index !== -1) {
            MOCK_NEWS.splice(index, 1);
            return true;
          }
          
          throw new Error('News item not found');
        }
        
        // In production, use Firestore
        const docRef = doc(db, 'news', id);
        await deleteDoc(docRef);
        return true;
      } catch (error) {
        console.error('Error deleting news:', error);
        throw error;
      }
    },
    
    // Search news
    searchNews: async (term) => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          const mockData = cloneMockData(MOCK_NEWS);
          return mockData.filter(item => 
            item.title.toLowerCase().includes(term.toLowerCase()) ||
            item.content.toLowerCase().includes(term.toLowerCase()) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(term.toLowerCase()))
          );
        }
        
        // In production, this would ideally use a search service like Algolia
        // For Firestore, we'll get all documents and filter client-side
        const querySnapshot = await getDocs(
          query(collection(db, 'news'), orderBy('publishDate', 'desc'))
        );
        
        const allNews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishDate: doc.data().publishDate?.toDate()
        }));
        
        // Simple search implementation
        return allNews.filter(item => 
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.content.toLowerCase().includes(term.toLowerCase()) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(term.toLowerCase()))
        );
      } catch (error) {
        console.error('Error searching news:', error);
        // Fallback to mock data if there's an error
        const mockData = cloneMockData(MOCK_NEWS);
        return mockData.filter(item => 
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.content.toLowerCase().includes(term.toLowerCase()) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(term.toLowerCase()))
        );
      }
    },
    
    // Add like to news
    likeNews: async (id) => {
      try {
        // In development, simulate API call
        if (isDevelopment) {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const index = MOCK_NEWS.findIndex(item => item.id === id);
          if (index !== -1) {
            MOCK_NEWS[index].likes += 1;
            return true;
          }
          
          throw new Error('News item not found');
        }
        
        // In production, use Firestore
        const docRef = doc(db, 'news', id);
        await updateDoc(docRef, {
          likes: increment(1)
        });
        return true;
      } catch (error) {
        console.error('Error liking news:', error);
        throw error;
      }
    },
    
    // Get related news
    getRelatedNews: async (currentNewsId, category, limit = 3) => {
      try {
        // In development, use mock data
        if (isDevelopment) {
          const mockData = cloneMockData(MOCK_NEWS);
          return mockData
            .filter(item => item.category === category && item.id !== currentNewsId)
            .sort((a, b) => b.publishDate - a.publishDate)
            .slice(0, limit);
        }
        
        // In production, use Firestore
        const querySnapshot = await getDocs(
          query(
            collection(db, 'news'),
            where('category', '==', category),
            orderBy('publishDate', 'desc'),
            limit(limit + 1) // Get one extra to filter out current article
          )
        );
        
        return querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishDate: doc.data().publishDate?.toDate()
          }))
          .filter(item => item.id !== currentNewsId)
          .slice(0, limit);
      } catch (error) {
        console.error('Error getting related news:', error);
        // Fallback to mock data if there's an error
        const mockData = cloneMockData(MOCK_NEWS);
        return mockData
          .filter(item => item.category === category && item.id !== currentNewsId)
          .sort((a, b) => b.publishDate - a.publishDate)
          .slice(0, limit);
      }
    }
  };
  
  export default newsService;