<?php
$data = filter_input(INPUT_POST, 'data', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
if (!empty($data)) {
    $scrapper = new Scrapper($data);
    $scrapper->save();
}

class Scrapper
{
	private $data = [];


	public function __construct(array $data = [])
	{
		$this->aggregate($data);
	}

	public function save()
	{
		file_put_contents('./prices.txt', $this->data);
	}

	private function aggregate($data)
	{
		foreach ($data as $params) {
			$this->data[] = $params['price_rub'] ?? 0;
		}
	}
}
