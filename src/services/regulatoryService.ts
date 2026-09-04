import { RegulatoryUpdate, RegulatoryUpdatesResponse } from '../types';
import { INITIAL_REGULATORY_UPDATES } from '../data/regulatoryUpdatesData';

const CACHE_KEY = 'soverify_regulatory_updates_cache';

export async function fetchRegulatoryUpdates(query?: string): Promise<RegulatoryUpdatesResponse> {
  try {
    const response = await fetch('/api/regulatory-updates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: query || '' })
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data: RegulatoryUpdatesResponse = await response.json();
    if (data && Array.isArray(data.updates) && data.updates.length > 0) {
      // Update cache
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (e) {
        // storage quota exceeded or disabled
      }
      return data;
    }
    throw new Error('Empty updates array from server');
  } catch (error) {
    console.warn('Using cached or fallback regulatory updates:', error);
    
    // Check localStorage cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.updates?.length) {
          return {
            ...parsed,
            isLiveSearch: false
          };
        }
      }
    } catch (e) {
      // ignore
    }

    // Default curated fallback
    return {
      success: true,
      updates: INITIAL_REGULATORY_UPDATES,
      searchQueries: ['site:cndp.ma actualités 2026', 'Moroccan Data Protection CNDP Decisions'],
      sources: [
        { title: 'CNDP - اللجنة الوطنية لحماية المعطيات الشخصية', uri: 'https://www.cndp.ma' },
        { title: 'الجريدة الرسمية للمملكة المغربية', uri: 'http://www.sgg.gov.ma' }
      ],
      isLiveSearch: false,
      timestamp: new Date().toISOString()
    };
  }
}
