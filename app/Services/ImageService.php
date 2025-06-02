<?php

namespace App\Services;

use App\Models\Image;
use Exception;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\ImageRepository;
use App\Services\Interfaces\ImageServiceInterface;
use ZipArchive;
use Aws\S3\S3Client;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image as InvertImage;
//use Intervention\Image\ImageManager as InvertImage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
class ImageService implements ImageServiceInterface
{
    protected $imageRepository;

    public function __construct(ImageRepository $imageRepository)
    {
        $this->imageRepository = $imageRepository;
    }

    public function getImages()
    {
        if (request()->is('api/*')) {
            return $this->imageRepository->getImages();
        }
        return $this->imageRepository->orderBy('created_at', 'desc')->get();
    }

    public function getImage($id)
    {
        return $this->imageRepository->getImage($id);
    }



    public function create(array $data)
    {
        $result = $this->imageRepository->create($data);
        return $result;
    }

    public function update(Image $image, array $data)
    {
        DB::beginTransaction();
        try {
            $result = $this->imageRepository->update($image, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error($exc->getMessage());
            throw new InvalidArgumentException('Unable to update image');
        }
        DB::commit();

        return $result;
    }

    public function destroy(Image $image)
    {
        DB::beginTransaction();
        try {
            $result = $this->imageRepository->destroy($image);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error($exc->getMessage());
            throw new InvalidArgumentException('Unable to delete image');
        }
        DB::commit();

        return $result;
    }

    /**
     * Store images from zip.
     * 
     * @param array $data
     * @param string $path
     * @return void
     */
    public function storeImagesFromZip(array $data, string $path, string $model_type, string $image_type = null)
    {
        try {
            $zip_file = $data['images'];
            $zip_path = $zip_file->getRealPath();
            $temp_dir = storage_path('app/tmp/' . auth()->id());
            Storage::deleteDirectory('tmp/' . auth()->id());
            $this->extractZip($zip_path, $temp_dir);
            //dd('yes temp');
            $this->validateImages($temp_dir, $model_type, $image_type);
            $this->uploadFoldersToS3($temp_dir, $path, $model_type);
            
            Storage::deleteDirectory('tmp/' . auth()->id());
        } catch (Exception $exc) {
            if ($exc instanceof ValidationException) {
                throw $exc;
            }
            Log::error($exc->getMessage());
            throw new InvalidArgumentException('Unable to store images');
        }
    }

    /**
     * Extract zip and store in storage.
     * 
     * @param string $zip_path
     * @param string $temp_dir
     * @return void
     */
    public function extractZip($zip_path, $temp_dir)
    {
        $zip = new ZipArchive();
        $zip->open($zip_path);
        $zip->extractTo($temp_dir);
        $zip->close();
    }

    /**
     * Extract zip and store in storage.
     * 
     * @param string $temp_dir
     * @param string $path
     * @return void
     */
    public function uploadFoldersToS3($temp_dir, $path, $model_type)
    {
        $files = scandir($temp_dir);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $file_path = $temp_dir . '/' . $file;
                $img = InvertImage::make($file_path);
                if ($model_type == config('constants.LABEL_NAME.ITEM')) {
                    $img->resize(config('constants.IMAGE_SIZE.LARGE'), config('constants.IMAGE_SIZE.LARGE'))->response();
                    Storage::disk('s3')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.LARGE'), $file), $img);

                    $img->resize(config('constants.IMAGE_SIZE.MEDIUM'), config('constants.IMAGE_SIZE.MEDIUM'))->response();
                    Storage::disk('s3')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file), $img);

                    $img->resize(config('constants.IMAGE_SIZE.SMALL'), config('constants.IMAGE_SIZE.SMALL'))->response();
                    Storage::disk('s3')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.SMALL'), $file), $img);

                    $img->resize(config('constants.IMAGE_SIZE.THUMBNAIL'), config('constants.IMAGE_SIZE.THUMBNAIL'))->response();
                    Storage::disk('s3')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.THUMBNAIL'), $file), $img);
                } elseif ($model_type == config('constants.LABEL_NAME.VENDOR')) {
                    $img->response();
                    Storage::disk('s3')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file), $img);

                    $img->resize(config('constants.IMAGE_SIZE.THUMBNAIL'), config('constants.IMAGE_SIZE.THUMBNAIL'))->response();
                    Storage::disk('s3')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.THUMBNAIL'), $file), $img);
                } elseif ($model_type == config('constants.LABEL_NAME.CATEGORY')) {
                    $img->resize(config('constants.IMAGE_SIZE.SMALL'), config('constants.IMAGE_SIZE.SMALL'))->response();
                    Storage::disk('s3')->put($path . '/' . $file, $img);
                }
            }
        }
    }

    public function uploadFoldersToPublic($temp_dir, $path, $model_type)
    {
        $files = scandir($temp_dir);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $file_path = $temp_dir . '/' . $file;
                $img = InvertImage::make($file_path);
                if ($model_type == config('constants.LABEL_NAME.ITEM')) {
                    $img->resize(config('constants.IMAGE_SIZE.LARGE'), config('constants.IMAGE_SIZE.LARGE'))->response();
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.LARGE'), $file), $img);

                    $img->resize(config('constants.IMAGE_SIZE.MEDIUM'), config('constants.IMAGE_SIZE.MEDIUM'))->response();
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file), $img);

                    $img->resize(config('constants.IMAGE_SIZE.SMALL'), config('constants.IMAGE_SIZE.SMALL'))->response();
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.SMALL'), $file), $img);

                    $img->resize(config('constants.IMAGE_SIZE.THUMBNAIL'), config('constants.IMAGE_SIZE.THUMBNAIL'))->response();
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.THUMBNAIL'), $file), $img);
                } elseif ($model_type == config('constants.LABEL_NAME.VENDOR')) {
                    $img->response();
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file), $img);

                    $img->resize(config('constants.IMAGE_SIZE.THUMBNAIL'), config('constants.IMAGE_SIZE.THUMBNAIL'))->response();
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.THUMBNAIL'), $file), $img);
                } elseif ($model_type == config('constants.LABEL_NAME.CATEGORY')) {
                    $img->resize(config('constants.IMAGE_SIZE.SMALL'), config('constants.IMAGE_SIZE.SMALL'))->response();
                    Storage::disk('public')->put($path . '/' . $file, $img);
                } elseif ($model_type == config('constants.LABEL_NAME.TEACHER')) {
                    $img->resize(config('constants.IMAGE_SIZE.MEDIUM'), config('constants.IMAGE_SIZE.MEDIUM'))->response();
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file), $img);
                } elseif ($model_type == config('constants.LABEL_NAME.STUDENT')) {
                    $img->resize(config('constants.IMAGE_SIZE.MEDIUM'), config('constants.IMAGE_SIZE.MEDIUM'))->response();
                    Storage::disk('public')->put($path . '/' . Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $file), $img);
                }
            }
        }
    }

    /**
     * validate image.
     * 
     * @param string $temp_dir
     * @param string $path
     * @return void
     */
    public function validateImages($temp_dir, $model_type, $image_type)
    {
        $files = scandir($temp_dir);
        $errors = [];
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $file_path = $temp_dir . '/' . $file;
                $img = InvertImage::make($file_path);
                if ($model_type == config('constants.LABEL_NAME.ITEM')) {
                    if ($img->width() != 1200 || $img->height() != 1200) {
                        $errors += [
                            $file => $file . ' has invalid dimensions.'
                        ];
                    }
                } elseif ($model_type == config('constants.LABEL_NAME.VENDOR')) {
                    if ($image_type == 'cover') {
                        if ($img->width() != 1200 || $img->height() != 400) {
                            $errors += [
                                $file => $file . ' has invalid dimensions.'
                            ];
                        }
                    } elseif ($image_type == 'logo') {
                        if ($img->width() != 500 || $img->height() != 500) {
                            $errors += [
                                $file => $file . ' has invalid dimensions.'
                            ];
                        }
                    }
                }
            }
        }
        if (!empty($errors)) {
            Storage::deleteDirectory('tmp/' . auth()->id());
            throw ValidationException::withMessages($errors);
        }
    }
}