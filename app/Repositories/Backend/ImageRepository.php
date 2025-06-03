<?php

namespace App\Repositories\Backend;

use App\Models\Image;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image as InvertImage;
use Illuminate\Support\Str;
use Intervention\Image\Exception\NotReadableException;
use Log;

class ImageRepository extends BaseRepository
{
    /**
     * @return string
     */
    public function model()
    {
        return Image::class;
    }

    public function getImages()
    {
        $images = Image::orderBy('id', 'desc');
        if (request()->has('paginate')) {
            $images = $images->paginate(request()->get('paginate'));
        } else {
            $images = $images->get();
        }
        return $images;
    }

    public function getImage($field, $value)
    {
        return Image::where($field, $value)->get();
    }

    /**
     * @param array $data
     *
     * @return Image
     */
    public function create(array $data): Image
    {
        $image = Image::create($data);
        return $image;
    }

    public function create_file($file, $path, $model_type)
    {
        $file_name = null;
        $image_url = null;
        if ($file) {
            if (gettype($file) == 'string') {
                $image_data = base64_decode($file);
                Log::info('Image data: ' . $image_data);
                $file_open = finfo_open();
                $extension = finfo_buffer($file_open, $image_data, FILEINFO_MIME_TYPE);
                
                $img = InvertImage::read($image_data);
                
                if ($model_type == config('constants.LABEL_NAME.TRANSACTION')) {
                    $file_name = uniqid() . time() . config('constants.IMAGE_FILE_NAME.MEDIUM') . str_replace("image/", "", $extension);
                    $image_url = $path . '/' . $file_name;
                    Storage::disk('public')->put($image_url, $image_data);
                }

                Log::info('Extension: ' . $extension);
                Log::info('File name: ' . $file_name);
                Log::info('File path: ' . $path);
                Log::info('File img: ' . $img);
            } else {
                $file_name = $file->getClientOriginalName();
                $img = InvertImage::read($file->getRealPath());
                $image_url = $path . '/' . $file_name;

                Storage::disk('public')->put($image_url, $img->toJpeg());
                
                if ($model_type == config('constants.LABEL_NAME.USER')) {
                    $img->cover(config('constants.IMAGE_SIZE.MEDIUM'), config('constants.IMAGE_SIZE.MEDIUM'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file_name), $img->toJpeg());
                   
                } 

                if ($model_type == config('constants.LABEL_NAME.POST')) {
                    $img->cover(config('constants.IMAGE_SIZE.INSIGHTWIDTH'), config('constants.IMAGE_SIZE.INSIGHTHEIGHT'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file_name), $img->toJpeg());
                    $img->cover(config('constants.IMAGE_SIZE.INSIGHTBANNERWIDTH'), config('constants.IMAGE_SIZE.INSIGHTBANNERHEIGHT'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.BANNER'), $file_name), $img->toJpeg());
                } 
                if ($model_type == config('constants.LABEL_NAME.POSTCATEGORY')) {
                    $img->cover(config('constants.IMAGE_SIZE.TOPICWIDTH'), config('constants.IMAGE_SIZE.TOPICHEIGHT'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file_name), $img->toJpeg());
                } 
                elseif ($model_type == config('constants.LABEL_NAME.PAGE')) {
                    $img->cover(config('constants.IMAGE_SIZE.XLARGE'), config('constants.IMAGE_SIZE.MEDIUM'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file_name), $img->toJpeg());
                } 
                // elseif ($model_type == config('constants.LABEL_NAME.SERVICE')) {
                //     $img->cover(config('constants.IMAGE_SIZE.XLARGE'), config('constants.IMAGE_SIZE.MEDIUM'));
                //     Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file_name), $img->toJpeg());
                // } 
                elseif ($model_type == config('constants.LABEL_NAME.SERVICEBANNER')) {
                    $img->cover(config('constants.IMAGE_SIZE.SERVICEBANNERWIDTH'), config('constants.IMAGE_SIZE.SERVICEBANNERHEIGHT'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.BANNER'), $file_name), $img->toJpeg());
                }
                elseif ($model_type == config('constants.LABEL_NAME.PROJECT')) {
                    $img->cover(config('constants.IMAGE_SIZE.PROJECTWIDTH'), config('constants.IMAGE_SIZE.PROJECTHEIGHT'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file_name), $img->toJpeg());
                } 
                elseif ($model_type == config('constants.LABEL_NAME.SLIDER')) {
                    $img->cover(config('constants.IMAGE_SIZE.SLIDERWIDTH'), config('constants.IMAGE_SIZE.SLIDERHEIGHT'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file_name), $img->toJpeg());
                } 
                elseif ($model_type == config('constants.LABEL_NAME.PARTNER')) {
                    $img->cover(config('constants.IMAGE_SIZE.PARTNER'), config('constants.IMAGE_SIZE.PARTNER'));
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file_name), $img->toJpeg());
                } 
            }
        }
        return $image_url;
    }

    /**
     * @param Image $image
     */
    public function destroy(Image $image)
    {
        $deleted = $this->deleteById($image->id);

        if ($deleted) {
            $image->save();
        }
    }

    /**
     * Delete image by ID
     */
    public function deleteImageById($imageId)
    {
        $image = $this->model->find($imageId);
        
        if ($image) {
            // Delete file from storage
            if (Storage::disk('public')->exists($image->image_url)) {
                Storage::disk('public')->delete($image->image_url);
            }
            
            // Delete database record
            return $image->delete();
        }
        
        return false;
    }
}