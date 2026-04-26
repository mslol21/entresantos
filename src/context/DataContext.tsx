import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { supabase } from '../lib/supabase';

interface ShopSettings {
  name: string;
  whatsapp: string;
  niche: string;
  instagram: string;
  tiktok: string;
  slogan: string;
}

interface DataContextType {
  products: Product[];
  settings: ShopSettings;
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateSettings: (settings: ShopSettings) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
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
      const mappedProducts = (productsData || []).map(p => ({
        ...p,
        isCustomizable: p.is_customizable,
        isActive: p.is_active,
        availableColors: p.available_colors,
        hasNameOption: p.has_name_option,
        variations: p.variations || [],
        customizationLists: p.customization_lists || []
      }));
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
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        subcategory: product.subcategory,
        is_customizable: product.isCustomizable,
        is_active: product.isActive,
        available_colors: product.availableColors,
        has_name_option: product.hasNameOption,
        variations: product.variations || [],
        customization_lists: product.customizationLists || []
      }])
      .select();

    if (error) throw error;
    await fetchData();
  };

  const updateProduct = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        subcategory: product.subcategory,
        is_customizable: product.isCustomizable,
        is_active: product.isActive,
        available_colors: product.availableColors,
        has_name_option: product.hasNameOption,
        variations: product.variations || [],
        customization_lists: product.customizationLists || []
      })
      .eq('id', product.id);

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
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  return (
    <DataContext.Provider value={{ products, settings, loading, addProduct, updateProduct, deleteProduct, updateSettings, uploadFile }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
