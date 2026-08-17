import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Product, Category, GlobalOption, ShopSettings, Transaction, Order,
  Collection, Saint, Quote
} from '../types';
import { supabase } from '../lib/supabase';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data';

const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.75): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface DataContextType {
  products: Product[];
  categories: Category[];
  globalOptions: GlobalOption[];
  settings: ShopSettings;
  transactions: Transaction[];
  orders: Order[];
  collections: Collection[];
  saints: Saint[];
  quotes: Quote[];
  loading: boolean;

  // Products
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Settings
  updateSettings: (settings: ShopSettings) => Promise<void>;

  // Files
  uploadFile: (file: File) => Promise<string>;

  // Categories
  addCategory: (name: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Global Options
  addGlobalOption: (option: Partial<GlobalOption>) => Promise<void>;
  updateGlobalOption: (option: GlobalOption) => Promise<void>;
  deleteGlobalOption: (id: string) => Promise<void>;

  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Orders
  addOrder: (order: Omit<Order, 'id' | 'status' | 'created_at'>) => Promise<string>;
  updateOrderStatus: (id: string, status: 'approved' | 'cancelled') => Promise<void>;
  updateOrderProductionStatus: (id: string, productionStatus: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  // Collections
  addCollection: (collection: Omit<Collection, 'id' | 'created_at'>) => Promise<void>;
  updateCollection: (collection: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;

  // Saints
  addSaint: (saint: Omit<Saint, 'id' | 'created_at'>) => Promise<void>;
  updateSaint: (saint: Saint) => Promise<void>;
  deleteSaint: (id: string) => Promise<void>;

  // Quotes
  addQuote: (quote: Omit<Quote, 'id' | 'status' | 'created_at'>) => Promise<void>;
  updateQuoteStatus: (id: string, status: Quote['status']) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalOptions, setGlobalOptions] = useState<GlobalOption[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [saints, setSaints] = useState<Saint[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({
    name: 'Ateliê Entre Santos',
    whatsapp: '',
    niche: '',
    instagram: '',
    tiktok: '',
    slogan: 'Fé feita à mão'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('db-realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'saints' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Products
      const { data: productsData, error: pError } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (pError) throw pError;

      const mappedProducts = (productsData || []).map(p => {
        const hasColorOption = p.available_colors?.includes('[HAS_COLOR_OPTION]') || false;
        const availableColors = p.available_colors?.replace('[HAS_COLOR_OPTION]', '').trim() || '';
        const imagesList = p.images && Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
        const categoriesList = p.categories && Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : []);
        return {
          ...p,
          image: p.image || imagesList[0] || '',
          images: imagesList.slice(0, 5),
          category: p.category || categoriesList[0] || '',
          categories: categoriesList,
          isCustomizable: p.is_customizable,
          isActive: p.is_active,
          isFeatured: !!p.is_featured,
          availableColors,
          hasColorOption,
          hasNameOption: p.has_name_option,
          namePrice: p.name_price,
          variations: p.variations || [],
          customizationLists: p.customization_lists || [],
          line: p.line || 'devocionais',
          availability: p.availability || 'ready',
        };
      });
      setProducts(mappedProducts);

      // Fetch Settings
      const { data: settingsData, error: sError } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (sError && sError.code !== 'PGRST116') throw sError;
      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*').order('name');
      if (catData && catData.length > 0) {
        setCategories(catData);
      } else {
        setCategories(INITIAL_CATEGORIES);
      }

      // Fetch Global Options
      const { data: optData } = await supabase.from('global_options').select('*').order('name');
      const mappedOptions = (optData || []).map(o => ({
        ...o,
        categoryIds: o.category_ids || []
      }));
      setGlobalOptions(mappedOptions);

      // Fetch Transactions
      try {
        const { data: txData, error: txError } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (!txError && txData) setTransactions(txData);
      } catch (e) {
        console.warn("Transactions table might not exist yet.", e);
      }

      // Fetch Orders
      try {
        const { data: ordersData, error: oError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!oError && ordersData) setOrders(ordersData);
      } catch (error) {
        console.warn('Orders table might not exist yet.', error);
      }

      // Fetch Collections
      try {
        const { data: colData } = await supabase
          .from('collections')
          .select('*')
          .order('display_order', { ascending: true });
        if (colData) setCollections(colData);
      } catch (e) {
        console.warn('Collections table might not exist yet.', e);
      }

      // Fetch Saints
      try {
        const { data: saintsData } = await supabase
          .from('saints')
          .select('*')
          .order('collection_number', { ascending: true });
        if (saintsData) setSaints(saintsData);
      } catch (e) {
        console.warn('Saints table might not exist yet.', e);
      }

      // Fetch Quotes (only for authenticated users — will return empty for anon)
      try {
        const { data: quotesData } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false });
        if (quotesData) setQuotes(quotesData);
      } catch (e) {
        console.warn('Quotes table might not exist yet.', e);
      }

      setLoading(false);
    }
  };

  // ==================== PRODUCTS ====================

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const isCustomizable = product.isCustomizable !== undefined ? product.isCustomizable : (product as any).is_customizable;
    const hasNameOption = product.hasNameOption !== undefined ? product.hasNameOption : (product as any).has_name_option;
    const isActive = product.isActive !== undefined ? product.isActive : (product as any).is_active;
    const hasColorOption = product.hasColorOption !== undefined ? product.hasColorOption : ((product as any).available_colors?.includes('[HAS_COLOR_OPTION]') || false);
    const availableColors = product.availableColors !== undefined ? product.availableColors : ((product as any).available_colors?.replace('[HAS_COLOR_OPTION]', '').trim() || '');

    const imagesList = product.images && product.images.length > 0 ? product.images.slice(0, 5) : (product.image ? [product.image] : []);
    const mainImage = imagesList[0] || product.image || '';
    const categoriesList = product.categories && product.categories.length > 0 ? product.categories : (product.category ? [product.category] : []);
    const mainCategory = categoriesList[0] || product.category || '';

    const fullPayload = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: mainImage,
      images: imagesList,
      category: mainCategory,
      categories: categoriesList,
      subcategory: product.subcategory,
      slug: product.slug || product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      sku: product.sku || null,
      line: product.line || 'devocionais',
      is_customizable: !!isCustomizable,
      is_active: isActive !== false,
      is_featured: !!product.isFeatured,
      available_colors: hasColorOption ? `${availableColors || ''} [HAS_COLOR_OPTION]`.trim() : (availableColors || ''),
      has_name_option: !!hasNameOption,
      variations: product.variations || [],
      customization_lists: product.customizationLists || [],
      name_price: product.namePrice || null,
      availability: product.availability || 'ready',
      production_days: product.production_days || null,
      stock: product.stock || 0,
      min_stock: product.min_stock || 1,
      edition_quantity: product.edition_quantity || null,
      collection_id: product.collection_id || null,
      collection_number: product.collection_number || null,
      collection_subtitle: product.collection_subtitle || null,
      saint_id: product.saint_id || null,
      promotional_price: product.promotional_price || null,
      materials: product.materials || null,
      care_instructions: product.care_instructions || null,
      display_order: product.display_order || 0,
    };

    let { error } = await supabase.from('products').insert([fullPayload]).select();

    if (error && (error.code === 'PGRST204' || error.message.includes('column'))) {
      // Fallback to basic payload if new columns don't exist yet
      const fallbackPayload: any = {
        name: fullPayload.name,
        description: fullPayload.description,
        price: fullPayload.price,
        image: fullPayload.image,
        images: fullPayload.images,
        category: fullPayload.category,
        categories: fullPayload.categories,
        subcategory: fullPayload.subcategory,
        is_customizable: fullPayload.is_customizable,
        is_active: fullPayload.is_active,
        is_featured: fullPayload.is_featured,
        available_colors: fullPayload.available_colors,
        has_name_option: fullPayload.has_name_option,
        variations: fullPayload.variations,
        customization_lists: fullPayload.customization_lists,
        name_price: fullPayload.name_price,
      };
      const resFallback = await supabase.from('products').insert([fallbackPayload]).select();
      error = resFallback.error;
    }

    if (error) throw error;
    await fetchData();
  };

  const updateProduct = async (product: Product) => {
    const isCustomizable = product.isCustomizable !== undefined ? product.isCustomizable : (product as any).is_customizable;
    const hasNameOption = product.hasNameOption !== undefined ? product.hasNameOption : (product as any).has_name_option;
    const isActive = product.isActive !== undefined ? product.isActive : (product as any).is_active;
    const hasColorOption = product.hasColorOption !== undefined ? product.hasColorOption : ((product as any).available_colors?.includes('[HAS_COLOR_OPTION]') || false);
    const availableColors = product.availableColors !== undefined ? product.availableColors : ((product as any).available_colors?.replace('[HAS_COLOR_OPTION]', '').trim() || '');

    const imagesList = product.images && product.images.length > 0 ? product.images.slice(0, 5) : (product.image ? [product.image] : []);
    const mainImage = imagesList[0] || product.image || '';
    const categoriesList = product.categories && product.categories.length > 0 ? product.categories : (product.category ? [product.category] : []);
    const mainCategory = categoriesList[0] || product.category || '';

    const fullPayload: any = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: mainImage,
      images: imagesList,
      category: mainCategory,
      categories: categoriesList,
      subcategory: product.subcategory,
      slug: product.slug,
      sku: product.sku,
      line: product.line || 'devocionais',
      is_customizable: !!isCustomizable,
      is_active: isActive !== false,
      is_featured: !!product.isFeatured,
      available_colors: hasColorOption ? `${availableColors || ''} [HAS_COLOR_OPTION]`.trim() : (availableColors || ''),
      has_name_option: !!hasNameOption,
      variations: product.variations || [],
      customization_lists: product.customizationLists || [],
      name_price: product.namePrice || null,
      availability: product.availability || 'ready',
      production_days: product.production_days || null,
      stock: product.stock ?? 0,
      min_stock: product.min_stock ?? 1,
      edition_quantity: product.edition_quantity || null,
      collection_id: product.collection_id || null,
      collection_number: product.collection_number || null,
      collection_subtitle: product.collection_subtitle || null,
      saint_id: product.saint_id || null,
      promotional_price: product.promotional_price || null,
      materials: product.materials || null,
      care_instructions: product.care_instructions || null,
      display_order: product.display_order ?? 0,
    };

    let { error } = await supabase.from('products').update(fullPayload).eq('id', product.id);

    if (error && (error.code === 'PGRST204' || error.message.includes('column'))) {
      const fallbackPayload: any = {
        name: fullPayload.name, description: fullPayload.description, price: fullPayload.price,
        image: fullPayload.image, images: fullPayload.images, category: fullPayload.category,
        categories: fullPayload.categories, subcategory: fullPayload.subcategory,
        is_customizable: fullPayload.is_customizable, is_active: fullPayload.is_active,
        is_featured: fullPayload.is_featured, available_colors: fullPayload.available_colors,
        has_name_option: fullPayload.has_name_option, variations: fullPayload.variations,
        customization_lists: fullPayload.customization_lists, name_price: fullPayload.name_price,
      };
      const resFallback = await supabase.from('products').update(fallbackPayload).eq('id', product.id);
      error = resFallback.error;
    }

    if (error) throw error;
    await fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  // ==================== SETTINGS ====================

  const updateSettings = async (newSettings: ShopSettings) => {
    const { error } = await supabase.from('settings').upsert({ id: 1, ...newSettings });
    if (error) throw error;
    setSettings(newSettings);
  };

  // ==================== FILES ====================

  const uploadFile = async (file: File) => {
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
      try {
        fileToUpload = await compressImage(file);
      } catch (err) {
        console.warn('Image compression failed, uploading original:', err);
      }
    }

    const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, fileToUpload);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('products').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // ==================== CATEGORIES ====================

  const addCategory = async (name: string) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ id: name.toLowerCase().replace(/\s+/g, '-'), name }])
      .select();
    if (error) console.error(error);
    if (data) setCategories([...categories, data[0]]);
  };

  const updateCategory = async (category: Category) => {
    const { error } = await supabase.from('categories').update({ name: category.name }).eq('id', category.id);
    if (error) console.error(error);
    setCategories(categories.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) console.error(error);
    setCategories(categories.filter(c => c.id !== id));
  };

  // ==================== GLOBAL OPTIONS ====================

  const addGlobalOption = async (option: Partial<GlobalOption>) => {
    const dbOption = { ...option, category_ids: option.categoryIds };
    delete (dbOption as any).categoryIds;
    const { data, error } = await supabase.from('global_options').insert([dbOption]).select();
    if (error) console.error(error);
    if (data) {
      const mapped = { ...data[0], categoryIds: data[0].category_ids };
      setGlobalOptions([...globalOptions, mapped]);
    }
  };

  const updateGlobalOption = async (option: GlobalOption) => {
    const dbOption = { ...option, category_ids: option.categoryIds };
    delete (dbOption as any).categoryIds;
    const { error } = await supabase.from('global_options').update(dbOption).eq('id', option.id);
    if (error) console.error(error);
    setGlobalOptions(globalOptions.map(o => o.id === option.id ? option : o));
  };

  const deleteGlobalOption = async (id: string) => {
    const { error } = await supabase.from('global_options').delete().eq('id', id);
    if (error) console.error(error);
    setGlobalOptions(globalOptions.filter(o => o.id !== id));
  };

  // ==================== TRANSACTIONS ====================

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('transactions').insert([transaction]).select();
    if (error) throw error;
    if (data) {
      setTransactions([data[0], ...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // ==================== ORDERS ====================

  const addOrder = async (order: Omit<Order, 'id' | 'status' | 'created_at'>) => {
    const { data, error } = await supabase.from('orders').insert([order]).select();
    if (error) throw error;
    if (data) {
      setOrders(prev => [data[0], ...prev]);
      return data[0].id;
    }
    return '';
  };

  const updateOrderStatus = async (id: string, status: 'approved' | 'cancelled') => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateOrderProductionStatus = async (id: string, productionStatus: string) => {
    const { error } = await supabase.from('orders').update({ production_status: productionStatus }).eq('id', id);
    if (error) throw error;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, production_status: productionStatus as any } : o));
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // ==================== COLLECTIONS ====================

  const addCollection = async (collection: Omit<Collection, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('collections').insert([collection]).select();
    if (error) throw error;
    if (data) setCollections(prev => [...prev, data[0]]);
  };

  const updateCollection = async (collection: Collection) => {
    const { error } = await supabase.from('collections').update(collection).eq('id', collection.id);
    if (error) throw error;
    setCollections(prev => prev.map(c => c.id === collection.id ? collection : c));
  };

  const deleteCollection = async (id: string) => {
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) throw error;
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  // ==================== SAINTS ====================

  const addSaint = async (saint: Omit<Saint, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('saints').insert([saint]).select();
    if (error) throw error;
    if (data) setSaints(prev => [...prev, data[0]]);
  };

  const updateSaint = async (saint: Saint) => {
    const { error } = await supabase.from('saints').update(saint).eq('id', saint.id);
    if (error) throw error;
    setSaints(prev => prev.map(s => s.id === saint.id ? saint : s));
  };

  const deleteSaint = async (id: string) => {
    const { error } = await supabase.from('saints').delete().eq('id', id);
    if (error) throw error;
    setSaints(prev => prev.filter(s => s.id !== id));
  };

  // ==================== QUOTES ====================

  const addQuote = async (quote: Omit<Quote, 'id' | 'status' | 'created_at'>) => {
    const { error } = await supabase.from('quotes').insert([{ ...quote, status: 'new' }]);
    if (error) throw error;
  };

  const updateQuoteStatus = async (id: string, status: Quote['status']) => {
    const { error } = await supabase.from('quotes').update({ status }).eq('id', id);
    if (error) throw error;
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const deleteQuote = async (id: string) => {
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (error) throw error;
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  return (
    <DataContext.Provider value={{
      products, settings, loading, categories, globalOptions, transactions, orders,
      collections, saints, quotes,
      addProduct, updateProduct, deleteProduct, updateSettings, uploadFile,
      addCategory, updateCategory, deleteCategory,
      addGlobalOption, updateGlobalOption, deleteGlobalOption,
      addTransaction, deleteTransaction,
      addOrder, updateOrderStatus, updateOrderProductionStatus, deleteOrder,
      addCollection, updateCollection, deleteCollection,
      addSaint, updateSaint, deleteSaint,
      addQuote, updateQuoteStatus, deleteQuote,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
