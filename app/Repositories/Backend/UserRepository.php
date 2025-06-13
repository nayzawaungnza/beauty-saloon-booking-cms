<?php

namespace App\Repositories\Backend;

use App\Enums\IsAdminStatusEnum;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Mail\SubscriberNotification;
use Illuminate\Support\Facades\Mail;
use Exception;

class UserRepository extends BaseRepository
{
    public function model()
    {
        return User::class;
    }
    
    public function getUsers($request, $is_active = null){
        
    }

    public function getUser($id){

    }
    public function create(array $data){
        $avatar = null;
        
        $path_name = 'users';
        if (isset($data['profile_image']) && $data['profile_image']) {
            $imageRepository = new ImageRepository();
           
            $avatar = $imageRepository->create_file($data['profile_image'], $path_name, config('constants.LABEL_NAME.USER'));
        }
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => isset($data['password']) ? Hash::make($data['password']) : Hash::make('password'),
            'mobile' => $data['mobile'] ?? null,
            'is_active'   => isset($data['is_active']) ? $data['is_active'] : 1,
            //'is_admin' => isset($data['is_admin']) ? $data['is_admin'] : 0,
            //'address'   => isset($data['address']) ? $data['address'] : null,
            //'avatar'    => $avatar ?? null,
            'is_blocked' => isset($data['is_blocked']) ? $data['is_blocked'] : 0,
            'is_subscribed' => isset($data['is_subscribed']) ? $data['is_subscribed'] : 0,
            'is_guest' => isset($data['is_guest']) ? $data['is_guest'] : 0,
            'created_by' => auth()->user()->id ?? null,
            'remember_token'   => isset($data['remember_token']) ? $data['remember_token'] : null,

        ]);

        if(isset($data['roles']) && $data['roles']) {
            $user->assignRole($data['roles']);
        }

        if (isset($data['profile_image'])) {
           
            $imageRepository = new ImageRepository();
            $image_path = $imageRepository->create_file($data['profile_image'], $path_name, config('constants.LABEL_NAME.USER'));
            $image_data['resourceable_type'] = 'User';
            $image_data['resourceable_id'] = $user->id;
            $image_data['image_url'] = $image_path;
            $image_data['is_default'] = config('constants.STATUS_TRUE');
            $image = $imageRepository->create($image_data);
            //dd($image_path);
        }
        
        
        // save activity in activitylog
        $activity_data['subject'] = $user;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) create User (%s).', $model_type, auth()->user()->name, $user->name);
        saveActivityLog($activity_data);

        return $user;
    }
    
    public function subscribe(array $data){
        $avatar = null;
        
        $path_name = 'users';
        $full_name = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
        
        if (isset($data['avatar']) && $data['avatar']) {
            $imageRepository = new ImageRepository();
           
            $avatar = $imageRepository->create_file($data['avatar'], $path_name, config('constants.LABEL_NAME.USER'));
        }
        $user = User::create([
            'name' => isset($data['name']) ? $data['name'] : $full_name,
            'email' => $data['email'],
            'password' => isset($data['password']) ? Hash::make($data['password']) : Hash::make('password'),
            'mobile' => $data['mobile'] ?? null,
            'is_active'   => isset($data['is_active']) ? $data['is_active'] : 1,
            'is_admin' => isset($data['is_admin']) ? $data['is_admin'] : 0,
            'address'   => isset($data['address']) ? $data['address'] : null,
            'avatar'    => $avatar ?? null,
            'remember_token'   => isset($data['remember_token']) ? $data['remember_token'] : null,
            
        ]);

        if (isset($data['avatar'])) {
           
            $imageRepository = new ImageRepository();
            $image_path = $imageRepository->create_file($data['avatar'], $path_name, config('constants.LABEL_NAME.USER'));
            $image_data['resourceable_type'] = 'User';
            $image_data['resourceable_id'] = $user->id;
            $image_data['image_url'] = $image_path;
            $image_data['is_default'] = config('constants.STATUS_TRUE');
            $image = $imageRepository->create($image_data);
            //dd($image_path);
        }
        
        
        // Log subscription event
    $activity_data['subject'] = $user;
    $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
    $activity_data['description'] = sprintf('New subscriber added: %s.', $user->email);
    saveActivityLog($activity_data);

    $adminEmail = ['hello@socialadsdigital.com'];
    $ccRecipients = ['nayzawaung.nza750@gmail.com'];
    $bccRecipients = ['nayzawaung.developer750@gmail.com'];

    try {
                // Send email (if this fails, transaction will roll back)
                Mail::to($adminEmail)
                    ->cc($ccRecipients)
                    ->bcc($bccRecipients)
                    ->send(new SubscriberNotification($user));
       
    } catch (\Exception $e) {
        Log::error('Failed to send subscriber notification', [
            'error' => $e->getMessage(),
            'data' => $data
        ]);
    }
    
        return $user;
    }

    public function update(User $user, array $data){
        $path_name = 'users';
        $imageRepository = new ImageRepository();

        $user->name = isset($data['name']) ? $data['name'] : $user->name;
        $user->email = isset($data['email']) ? $data['email'] : $user->email;
        $user->mobile =  $data['mobile'];
        $user->password = isset($data['password']) ? Hash::make($data['password']) : $user->password;
        $user->is_active = isset($data['is_active']) ? $data['is_active'] : $user->is_active;
        $user->is_blocked = isset($data['is_blocked']) ? $data['is_blocked'] : $user->is_blocked;
        $user->is_subscribed = isset($data['is_subscribed']) ? $data['is_subscribed'] : $user->is_subscribed;
        //$user->is_admin = isset($data['is_admin']) ? $data['is_admin'] : $user->is_admin;
        //$user->address = isset($data['address']) ? $data['address'] : $user->address;
        if (isset($data['profile_image']) && $data['profile_image']) {
            $avatar = $imageRepository->create_file($data['profile_image'], $path_name, config('constants.LABEL_NAME.USER'));

            // Delete the old avatar if a new one is uploaded
            if ($user->default_image) {
                Storage::disk('public')->delete($user->default_image->image_url);
                $previous_avatar = $user->default_image;
                Log::info("Previous avatar image url: {$previous_avatar}");
                $medium_img = Str::replaceLast('.', config('constants.IMAGE_FILE_NAME.MEDIUM'), $previous_avatar->image_url);
                if (Storage::disk('public')->exists($path_name . '/' . $medium_img)) {
                    Storage::disk('public')->delete($path_name . '/' . $medium_img);
                    Log::info("Deleted medium image: {$medium_img}");
                } else {
                    Log::info("Medium image does not exist: {$medium_img}");
                }
                
                $imageRepository->destroy($previous_avatar);
            }
            //$user->avatar = $avatar;
        }

        if(isset($data['profile_image']) && $data['profile_image'])
        {
            $image_path = $imageRepository->create_file($data['profile_image'], $path_name, config('constants.LABEL_NAME.USER'));
            $image_data['resourceable_type'] = 'User';
            $image_data['resourceable_id'] = $user->id;
            $image_data['image_url'] = $image_path;
            $image_data['is_default'] = config('constants.STATUS_TRUE');
            $image = $imageRepository->create($image_data);
        }
        
        if ($user->isDirty()) {
            $user->save();
        }
        DB::table('model_has_roles')->where('model_id', $user->id)->delete();
        $user->assignRole($data['roles']);

        // save activity in activitylog
        $activity_data['subject'] = $user->refresh();
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $activity_data['description'] = sprintf('User(%s) updated User Account(%s).', auth()->user()->name, $user->name);
        saveActivityLog($activity_data);
        return $user;
    }

    public function destroy(User $user){
        $deleted = $this->deleteById($user->id);
        if ($deleted) {
            $user->save();
        }

        // save activity in activitylog
        $activity_data['subject'] = $user;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) delete post(%s).', $model_type, auth()->user()->name, $user->name);
        saveActivityLog($activity_data);
    }

    public function changeStatus( User $user ){
        if ($user->is_active == 0) {
            $user->is_active = 1;
        } else {
            $user->is_active = 0;
        }
        if ($user->isDirty()) {
            //    $main_service->updated_by = $data['updatedBy'];
            $user->save();
        }

        // save activity in activitylog
        $activity_data['subject'] = $user->refresh();
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) update User Account(%s) status.', $model_type, auth()->user()->name, $user->name);
        saveActivityLog($activity_data);
        return $user;
    }

    public function getUsersCount($filter){
        return User::count($filter);
    }

    public function checkActiveUser(array $data){

    }

    public function getUserEloquent(){
        return User::query()
            ->with(['roles'])->select('users.*')->get();
    }
    public function getCustomers()
    {
        return $this->model()::query()->role('User')->get();
    }

    public function getClientEloquent()
    {
        return User::query()->where('is_admin', 2)->with(['roles'])->select('users.*');
    }
    
    public function getSubscriberEloquent()
    {
        return User::query()->where('is_admin', 0)->with(['roles'])->select('users.*');
    }

    public function getClients()
    {
        return User::where('is_admin', 2)->get();
    }

    public function getSubscribers()
    {
        return User::where('is_admin', 0)->get();
    }
    
}