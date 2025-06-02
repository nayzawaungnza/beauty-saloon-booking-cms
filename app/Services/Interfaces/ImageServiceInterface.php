<?php

namespace App\Services\Interfaces;

use App\Models\Image;

interface ImageServiceInterface
{
    public function getImages();
    public function getImage($id);
    public function create(array $data);
    public function update(Image $image,array $data);
    public function destroy(Image $image);
    public function storeImagesFromZip(array $data, string $path, string $model_type);
}