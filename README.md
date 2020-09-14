# NoxFile-Service

A foundational servcie which serves other services like a file system.

## Functionality
Acting like a normal File System.
> A file is a group of data. The structure and logic rules used to manage the groups of data and their names is called a "file system".
-- [[ref]](https://en.wikipedia.org/wiki/File_system)
* do
* something


## Architecture
* 3 layers of fs
  - logical file system: provides file access, directory operations, security and protection
  - virtual file system: allows support for multiple concurrent instances of physical file systems, each of which is called a file system implementation
  - physical file system: physical operation of the storage device (e.g. disk)
* Aspects of FS
  - Space management
  - Directories
  - Metadata
  - Utilities
  - Restricting and permitting access
  - Maintaining integrity(failures handling)
  - Using a file system(API)
  - Multiple file systems within a single system
    - not interfering with allocations of other files
    - different permission
    - virtualization: multiple systems
    - corruption only happens in  a single partition

##  Random Notes
Stream Large File(read and write)?
events driven?
event Log for debugging

* offer some [special FS](https://en.wikipedia.org/wiki/File_system#Special_file_systems)
    - Minimal file system(for low end device)
    - Flat file systems(no subdirectories)
    - configfs, sysfs, procfs

Some Concern:

* End user environment
    * small strage
    * unstable internet condition(unstable throughput)
    * corrupt at anytime

=> The operatoin should be small and fast so that we can restart the operation quickly and without losing too many progress.

heterogeneous distributed database
@noowyee: seperate files into blob/chunks
