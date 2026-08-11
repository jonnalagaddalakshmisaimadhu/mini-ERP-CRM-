import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { authenticate } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

let supabaseClient: any = null;

const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (supabaseUrl && supabaseKey) {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
  }
  return supabaseClient;
};

// Use multer with memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const supabase = getSupabase();

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase credentials are not configured' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    res.json({ imageUrl: publicUrlData.publicUrl });
  } catch (err) {
    console.error('Upload handler error:', err);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

export default router;
