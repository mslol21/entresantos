import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Category, GlobalOption, ShopSettings, Transaction, Order } from '../types';
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
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateSettings: (settings: ShopSettings) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addGlobalOption: (option: Partial<GlobalOption>) => Promise<void>;
  updateGlobalOption: (option: GlobalOption) => Promise<void>;
  deleteGlobalOption: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'created_at'>) => Promise<string>;
  updateOrderStatus: (id: string, status: 'approved' | 'cancelled') => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalOptions, setGlobalOptions] = useState<GlobalOption[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({
    name: 'Ateliê Entre Santos',
    whatsapp: '',
    niche: '',
    instagram: '',
    tiktok: '',
    slogan: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    // Inscrever para atualizações em tempo real das tabelas no Supabase
    const channel = supabase
      .channel('db-realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        fetchData();
      })
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
        .order('created_at', { ascending: false });

      if (pError) throw pError;
      
      // Map Supabase snake_case to camelCase if necessary, or just use as is if types match
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
          customizationLists: p.customization_lists || []
        };
      });
      setProducts(mappedProducts);

      // Fetch Settings
      const { data: settingsData, error: sError } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (sError && sError.code !== 'PGRST116') throw sError; // PGRST116 is 'no rows'
      
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
        if (!txError && txData) {
          setTransactions(txData);
        }
      } catch (e) {
        console.warn("Transactions table might not exist yet.", e);
      }

      // Fetch Orders
      try {
        const { data: ordersData, error: oError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!oError && ordersData) {
          setOrders(ordersData);
        }
      } catch (error) {
        console.warn('Orders table might not exist yet.', error);
      }

      setLoading(false);
    }
  };

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
      is_customizable: !!isCustomizable,
      is_active: isActive !== false,
      is_featured: !!product.isFeatured,
      available_colors: hasColorOption ? `${availableColors || ''} [HAS_COLOR_OPTION]`.trim() : (availableColors || ''),
      has_name_option: !!hasNameOption,
      variations: product.variations || [],
      customization_lists: product.customizationLists || [],
      name_price: product.namePrice || null
    };

    let { error } = await supabase.from('products').insert([fullPayload]).select();

    if (error && (error.code === 'PGRST204' || error.message.includes('column'))) {
      const fallbackPayload = { ...fullPayload };
      delete (fallbackPayload as any).images;
      delete (fallbackPayload as any).categories;
      delete (fallbackPayload as any).is_featured;
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

    const fullPayload = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: mainImage,
      images: imagesList,
      category: mainCategory,
      categories: categoriesList,
      subcategory: product.subcategory,
      is_customizable: !!isCustomizable,
      is_active: isActive !== false,
      is_featured: !!product.isFeatured,
      available_colors: hasColorOption ? `${availableColors || ''} [HAS_COLOR_OPTION]`.trim() : (availableColors || ''),
      has_name_option: !!hasNameOption,
      variations: product.variations || [],
      customization_lists: product.customizationLists || [],
      name_price: product.namePrice || null
    };

    let { error } = await supabase.from('products').update(fullPayload).eq('id', product.id);

    if (error && (error.code === 'PGRST204' || error.message.includes('column'))) {
      const fallbackPayload = { ...fullPayload };
      delete (fallbackPayload as any).images;
      delete (fallbackPayload as any).categories;
      delete (fallbackPayload as any).is_featured;
      const resFallback = await supabase.from('products').update(fallbackPayload).eq('id', product.id);
      error = resFallback.error;
    }

    if (error) throw error;
    await fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchData();
  };

  const updateSettings = async (newSettings: ShopSettings) => {
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...newSettings });

    if (error) throw error;
    setSettings(newSettings);
  };

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
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, fileToUpload);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const addCategory = async (name: string) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ id: name.toLowerCase().replace(/\s+/g, '-'), name }])
      .select();
    if (error) console.error(error);
    if (data) setCategories([...categories, data[0]]);
  };

  const updateCategory = async (category: Category) => {
    const { error } = await supabase
      .from('categories')
      .update({ name: category.name })
      .eq('id', category.id);
    if (error) console.error(error);
    setCategories(categories.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) console.error(error);
    setCategories(categories.filter(c => c.id !== id));
  };

  const addGlobalOption = async (option: Partial<GlobalOption>) => {
    const dbOption = {
      ...option,
      category_ids: option.categoryIds
    };
    delete (dbOption as any).categoryIds;

    const { data, error } = await supabase
      .from('global_options')
      .insert([dbOption])
      .select();
    
    if (error) console.error(error);
    if (data) {
      const mapped = { ...data[0], categoryIds: data[0].category_ids };
      setGlobalOptions([...globalOptions, mapped]);
    }
  };

  const updateGlobalOption = async (option: GlobalOption) => {
    const dbOption = {
      ...option,
      category_ids: option.categoryIds
    };
    delete (dbOption as any).categoryIds;

    const { error } = await supabase
      .from('global_options')
      .update(dbOption)
      .eq('id', option.id);
    
    if (error) console.error(error);
    setGlobalOptions(globalOptions.map(o => o.id === option.id ? option : o));
  };

  const deleteGlobalOption = async (id: string) => {
    const { error } = await supabase.from('global_options').delete().eq('id', id);
    if (error) console.error(error);
    setGlobalOptions(globalOptions.filter(o => o.id !== id));
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select();
    
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

  const addOrder = async (order: Omit<Order, 'id' | 'status' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();
    
    if (error) throw error;
    if (data) {
      setOrders(prev => [data[0], ...prev]);
      return data[0].id;
    }
    return '';
  };

  const updateOrderStatus = async (id: string, status: 'approved' | 'cancelled') => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <DataContext.Provider value={{ 
      products, settings, loading, categories, globalOptions, transactions, orders,
      addProduct, updateProduct, deleteProduct, updateSettings, uploadFile,
      addCategory, updateCategory, deleteCategory,
      addGlobalOption, updateGlobalOption, deleteGlobalOption,
      addTransaction, deleteTransaction,
      addOrder, updateOrderStatus, deleteOrder
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
