import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Category, GlobalOption, ShopSettings } from '../types';
import { supabase } from '../lib/supabase';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data';

interface DataContextType {
  products: Product[];
  categories: Category[];
  globalOptions: GlobalOption[];
  settings: ShopSettings;
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalOptions, setGlobalOptions] = useState<GlobalOption[]>([]);
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
        namePrice: p.name_price,
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
        customization_lists: product.customizationLists || [],
        name_price: product.namePrice
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
        customization_lists: product.customizationLists || [],
        name_price: product.namePrice
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

  return (
    <DataContext.Provider value={{ 
      products, settings, loading, categories, globalOptions,
      addProduct, updateProduct, deleteProduct, updateSettings, uploadFile,
      addCategory, updateCategory, deleteCategory,
      addGlobalOption, updateGlobalOption, deleteGlobalOption
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
