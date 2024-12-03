import "react-native-url-polyfill/auto"
import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage"
import {createClient} from "@supabase/supabase-js"

const supabaseUrl = "https://fuzmoocrqhfjczqakqer.supabase.co"

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1em1vb2NycWhmamN6cWFrcWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NjIzNjQsImV4cCI6MjA0NzAzODM2NH0.Sn_5j6nJOJElJUAHNKfdsg8GXOn39N1nlVI0BIJCXys"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth:{
        storage: AsyncStorage,
        autoRefreshToken:true,
        persistSession: true,
        detectSessionInUrl: false,
        
    }
})