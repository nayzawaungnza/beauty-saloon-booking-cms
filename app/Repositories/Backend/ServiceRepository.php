<?php
namespace App\Repositories\Backend;

use App\Models\Service;
use App\Repositories\BaseRepository;
use App\Repositories\Backend\ImageRepository;

class ServiceRepository extends BaseRepository
{
    public function model()
    {
        return Service::class;
    }

    public function create(array $data)
    {
        $path_name = 'services';
        $imageRepository = new ImageRepository();
        
        $service = $this->model->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'duration' => $data['duration'] ?? null,
            'price' => $data['price'] ?? null,
            'excerpt' => $data['excerpt'] ?? null,
            'is_promotion' => $data['is_promotion'] ?? false,
            'discount_price' => $data['discount_price'] ?? null,
            'requires_buffer' => $data['requires_buffer'] ?? false,
            'is_active' => $data['is_active'] ?? true,
            'created_by' => auth()->user()->id
        ]);
        if (isset($data['service_image'])) {
           
            $image_path = $imageRepository->create_file($data['service_image'], $path_name, config('constants.LABEL_NAME.SERVICE'));
            $image_data['resourceable_type'] = 'Service';
            $image_data['resourceable_id'] = $service->id;
            $image_data['image_url'] = $image_path;
            $image_data['is_default'] = config('constants.STATUS_TRUE');
            $image = $imageRepository->create($image_data);
            //dd($image_path);
        }

        if (isset($data['gallery_images'])) {
            foreach ($data['gallery_images'] as $key => $image) {
                $image_path = $imageRepository->create_file($image, $path_name, config('constants.LABEL_NAME.SERVICE'));
                $image_data['resourceable_type'] = 'Service';
                $image_data['resourceable_id'] = $service->id;
                $image_data['image_url'] = $image_path;
                $image_data['is_default'] = config('constants.STATUS_FALSE');
                $image = $imageRepository->create($image_data);
                //dd($image_path);
            }
        }
           
           
        
        $activity_data['subject'] = $service;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) create service (%s).', $model_type, auth()->user()->name, $service->name);
        saveActivityLog($activity_data);

        return $service;
    }

    public function update(Service $service, array $data) {
        $path_name = 'services';
        $imageRepository = new ImageRepository();
        
        // Handle image deletions first
        if (isset($data['delete_images']) && is_array($data['delete_images'])) {
            foreach ($data['delete_images'] as $imageId) {
                $imageRepository->deleteImageById($imageId);
            }
        }
        
        // Update service data
        $service->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? $service->description,
            'duration' => $data['duration'] ?? $service->duration,
            'price' => $data['price'] ?? $service->price,
            'excerpt' => $data['excerpt'] ?? $service->excerpt,
            'is_promotion' => $data['is_promotion'] ?? $service->is_promotion,
            'discount_price' => $data['discount_price'] ?? $service->discount_price,
            'requires_buffer' => $data['requires_buffer'] ?? $service->requires_buffer,
            'is_active' => $data['is_active'] ?? $service->is_active,
            'updated_by' => auth()->user()->id
        ]);
        
        // Handle new service image
        if (isset($data['service_image'])) {
            // Delete existing default image
            $existingDefaultImage = $service->default_image;
            if ($existingDefaultImage) {
                $imageRepository->deleteImageById($existingDefaultImage->id);
            }
            
            $image_path = $imageRepository->create_file($data['service_image'], $path_name, config('constants.LABEL_NAME.SERVICE'));
            $image_data = [
                'resourceable_type' => 'Service',
                'resourceable_id' => $service->id,
                'image_url' => $image_path,
                'is_default' => config('constants.STATUS_TRUE')
            ];
            $imageRepository->create($image_data);
        }

        // Handle new gallery images
        if (isset($data['gallery_images']) && is_array($data['gallery_images'])) {
            foreach ($data['gallery_images'] as $image) {
                if ($image) {
                    $image_path = $imageRepository->create_file($image, $path_name, config('constants.LABEL_NAME.SERVICE'));
                    $image_data = [
                        'resourceable_type' => 'Service',
                        'resourceable_id' => $service->id,
                        'image_url' => $image_path,
                        'is_default' => config('constants.STATUS_FALSE')
                    ];
                    $imageRepository->create($image_data);
                }
            }
        }
        
        // Log activity
        $activity_data['subject'] = $service;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) updated service (%s).', $model_type, auth()->user()->name, $service->name);
        saveActivityLog($activity_data);

        return $service->fresh(['createdBy', 'updatedBy', 'default_image', 'gallery_images']);
    }

    public function changeStatus(Service $service) {
        $service->update(['is_active' => !$service->is_active]);
        
        // Log activity
        $activity_data['subject'] = $service;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) updated service (%s).', $model_type, auth()->user()->name, $service->name);
        saveActivityLog($activity_data);
        return $service;
    }

    public function destroy(Service $service) {
        $deleted = $this->deleteById($service->id);
        if ($deleted) {
            $service->save();
        }
        
        // Log activity
        $activity_data['subject'] = $service;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) deleted service (%s).', $model_type, auth()->user()->name, $service->name);
        saveActivityLog($activity_data);

        return $service;
    }

    public function getServices(){
        return $this->model->where('is_active',1)
            ->with('createdBy', 'updatedBy', 'default_image', 'gallery_images')->orderBy('created_at', 'desc')->get();
    }

    public function getServiceBySlug(string $slug){
        return $this->model->where('slug', $slug)->with('createdBy', 'updatedBy', 'default_image', 'gallery_images')->first();
    }

    public function getServiceEloquent()
    {
        return $this->model
                ->with('createdBy', 'updatedBy', 'default_image', 'gallery_images')->orderBy('created_at', 'desc')->get();
    }
}