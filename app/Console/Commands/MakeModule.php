<?php

     namespace App\Console\Commands;

     use Illuminate\Console\Command;
     use Illuminate\Support\Str;
     use Illuminate\Filesystem\Filesystem;

     class MakeModule extends Command
     {
         protected $signature = 'make:module {name}';
         protected $description = 'Create a new module with Controller, Service, Service Interface, Repository, and Requests';

         protected $files;

         public function __construct(Filesystem $files)
         {
             parent::__construct();
             $this->files = $files;
         }

         public function handle()
         {
             $name = $this->argument('name');
             $lowerName = Str::lower($name);

             // Create directories if they don't exist
             $this->createDirectories();

             // Generate files
             $this->createController($name, $lowerName);
             $this->createService($name);
             $this->createServiceInterface($name);
             $this->createRepository($name);
             $this->createRequests($name);

             $this->info("Module {$name} created successfully!");
         }

         protected function createDirectories()
         {
             $directories = [
                 'app/Http/Controllers/Backend',
                 'app/Services/Interfaces',
                 'app/Repositories/Backend',
                 'app/Http/Requests',
             ];

             foreach ($directories as $dir) {
                 if (!$this->files->exists($dir)) {
                     $this->files->makeDirectory($dir, 0755, true);
                     $this->info("Created directory: {$dir}");
                 }
             }
         }

         protected function createController($name, $lowerName)
         {
             $stub = $this->getStub('Controller');
             $path = "app/Http/Controllers/Backend/{$name}Controller.php";
             $content = str_replace(
                 ['{{name}}', '{{lowerName}}'],
                 [$name, $lowerName],
                 $stub
             );
             $this->files->put($path, $content);
             $this->info("Created Controller: {$path}");
         }

         protected function createService($name)
         {
             $stub = $this->getStub('Service');
             $path = "app/Services/{$name}Service.php";
             $content = str_replace('{{name}}', $name, $stub);
             $this->files->put($path, $content);
             $this->info("Created Service: {$path}");
         }

         protected function createServiceInterface($name)
         {
             $stub = $this->getStub('ServiceInterface');
             $path = "app/Services/Interfaces/{$name}ServiceInterface.php";
             $content = str_replace('{{name}}', $name, $stub);
             $this->files->put($path, $content);
             $this->info("Created Service Interface: {$path}");
         }

         protected function createRepository($name)
         {
             $stub = $this->getStub('Repository');
             $path = "app/Repositories/Backend/{$name}Repository.php";
             $content = str_replace('{{name}}', $name, $stub);
             $this->files->put($path, $content);
             $this->info("Created Repository: {$path}");
         }

         protected function createRequests($name)
         {
             $this->files->makeDirectory("app/Http/Requests/{$name}", 0755, true);

             // Create Request
             $stub = $this->getStub('CreateRequest');
             $path = "app/Http/Requests/{$name}/Create{$name}Request.php";
             $content = str_replace('{{name}}', $name, $stub);
             $this->files->put($path, $content);
             $this->info("Created Create Request: {$path}");

             // Update Request
             $stub = $this->getStub('UpdateRequest');
             $path = "app/Http/Requests/{$name}/Update{$name}Request.php";
             $content = str_replace('{{name}}', $name, $stub);
             $this->files->put($path, $content);
             $this->info("Created Update Request: {$path}");
         }

         protected function getStub($type)
         {
             $stubs = [
                 'Controller' => "<?php\n\nnamespace App\Http\Controllers\Backend;\n\nuse App\Http\Controllers\Controller;\nuse Illuminate\Http\Request;\nuse App\Services\\{{name}}Service;\nuse App\Models\\{{name}};\nuse App\Http\Requests\\{{name}}\\Create{{name}}Request;\nuse App\Http\Requests\\{{name}}\\Update{{name}}Request;\n\nclass {{name}}Controller extends Controller\n{\n    protected \$service;\n\n    public function __construct({{name}}Service \$service)\n    {\n        \$this->middleware('permission:{{lowerName}}.view', ['only' => ['index', 'show']]);\n        \$this->middleware('permission:{{lowerName}}.create', ['only' => ['create', 'store']]);\n        \$this->middleware('permission:{{lowerName}}.edit', ['only' => ['edit', 'update']]);\n        \$this->middleware('permission:{{lowerName}}.delete', ['only' => ['destroy']]);\n        \$this->service = \$service;\n    }\n\n    /**\n     * Display a listing of the resource.\n     */\n    public function index()\n    {\n        //\n    }\n\n    /**\n     * Show the form for creating a new resource.\n     */\n    public function create()\n    {\n        //\n    }\n\n    /**\n     * Store a newly created resource in storage.\n     */\n    public function store(Create{{name}}Request \$request)\n    {\n        //\n    }\n\n    /**\n     * Display the specified resource.\n     */\n    public function show({{name}} \${{lowerName}})\n    {\n        //\n    }\n\n    /**\n     * Show the form for editing the specified resource.\n     */\n    public function edit({{name}} \${{lowerName}})\n    {\n        //\n    }\n\n    /**\n     * Update the specified resource in storage.\n     */\n    public function update(Update{{name}}Request \$request, {{name}} \${{lowerName}})\n    {\n        //\n    }\n\n    /**\n     * Remove the specified resource from storage.\n     */\n    public function destroy({{name}} \${{lowerName}})\n    {\n        //\n    }\n}\n",
                 'Service' => "<?php\n\nnamespace App\Services;\n\nuse App\Repositories\Backend\\{{name}}Repository;\nuse App\Services\Interfaces\\{{name}}ServiceInterface;\n\nclass {{name}}Service implements {{name}}ServiceInterface\n{\n    protected \$repository;\n\n    public function __construct({{name}}Repository \$repository)\n    {\n        \$this->repository = \$repository;\n    }\n\n    // Add methods\n}\n",
                 'ServiceInterface' => "<?php\n\nnamespace App\Services\Interfaces;\n\ninterface {{name}}ServiceInterface\n{\n    // Define methods\n}\n",
                 'Repository' => "<?php\n\nnamespace App\Repositories\Backend;\n\nuse App\Models\\{{name}};\n\nuse App\Repositories\BaseRepository;\n\nclass {{name}}Repository extends BaseRepository\n{\n   public function model()\n    {\n        return {{name}}::class;\n    }\n    // Add methods\n}\n",
                 'CreateRequest' => "<?php\n\nnamespace App\Http\Requests\\{{name}};\n\nuse Illuminate\Foundation\Http\FormRequest;\n\nclass Create{{name}}Request extends FormRequest\n{\n    public function authorize()\n    {\n        return true;\n    }\n\n    public function rules()\n    {\n        return [];\n    }\n}\n",
                 'UpdateRequest' => "<?php\n\nnamespace App\Http\Requests\\{{name}};\n\nuse Illuminate\Foundation\Http\FormRequest;\n\nclass Update{{name}}Request extends FormRequest\n{\n    public function authorize()\n    {\n        return true;\n    }\n\n    public function rules()\n    {\n        return [];\n    }\n}\n",
             ];

             return $stubs[$type];
         }
     }