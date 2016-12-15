Param(
    [string] $path
 )

$FileName = $path
Start-Process -FilePath $FileName -Verb Print
